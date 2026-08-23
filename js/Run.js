import fs from "fs"
import { ToBrainFuck } from "./toBF.js";
import util from 'util'
import { log } from "console";

let printStr = ""




// 预置输入字节，用完自动EOF，不再等待键盘
let inputBuf = []

let inputBf = "++++++[>++++++++++<-]>+++++."
inputBuf = inputBf.split("").map(c => c.charCodeAt(0)) // 预置输入字节，测试用



const runOneCommand = (global, command, commandLineArr, operand, argument, i, allCodeArr, jump) => {


    switch (command) {
        case ".":

        case "print":
            printStr += String.fromCharCode(global.memory[global.pointer])
            
            break

        case ",":
        case "input":
            // 读取输入的字符，并将其存储在内存中
            function readOneByteSync() {
                // 缓冲区还有数据就消耗，用完直接返回0，不阻塞读键盘
                if (inputBuf.length > 0) {
                    // console.log(inputBuf)

                    return inputBuf.shift();
                }
                // 缓冲区耗尽，返回EOF，不再调用fs.readSync，不会卡死！
                console.log("输入缓冲区耗尽，返回EOF，程序继续执行");
                return 0;
            }
            const inputChar = readOneByteSync()

            // if (inputChar == "\r" || inputChar == "\n") {
            //     break; // 忽略回车和换行
            // }

            global.memory[global.pointer] = inputChar
            // console.log("已输入", inputChar, String.fromCharCode(inputChar))
            // console.log(global.pointer, global.memory)

            break;


        case "push":
            global.memory[global.pointer] = operand
            break;


        case "[":
        case "start":
            if (global.memory[global.pointer] == 0) {
                i = jump.get(i) - 1
            }

            break

        case "]":
        case "end":
            if (global.memory[global.pointer] != 0) {
                i = jump.get(i) - 1
            }
            break

        case "+":
        case "add":
            operand = (operand === undefined || operand === null) ? 1 : operand
            global.memory[global.pointer] += operand
            break;

        case "-":
        case "sub":
            operand = (operand === undefined || operand === null) ? 1 : operand
            global.memory[global.pointer] -= operand
            break;

        case "<":
        case "left":
            if (global.pointer - operand < 0) {
                console.error(global.pointer)
                console.error("错误：指针不能指向负数位置，已强制设置为0")
                // global.pointer = 0
            } else {
                global.pointer -= operand
            }
            break;


        case ">":
        case "right":
            // console.log("> debug operand =", operand, typeof operand);

            global.pointer += operand
            if (global.pointer >= global.memory.length) {
                console.error("错误：指针超出内存范围，已强制设置为最大值")
                global.pointer = global.memory.length - 1
            }
            break;


        case "fun":
            let endLine = i
            while (endLine < allCodeArr.length && allCodeArr[endLine] != "funEnd" && allCodeArr[endLine] != "}") {
                endLine++
            }
            // console.log("endLine", endLine)
            global.funs.push({
                name: commandLineArr[1],
                startLine: i,
                endLine: endLine,
            })
            i = endLine
            break;
        case "run":
            global.funStack.push(i)
            const fun = global.funs.find((fun) => fun.name === argument);
            console.log(fun);
            i = fun.startLine  // 主循环会自增，这里不能+1
            break;
        case "funEnd":
            // console.log(global.funStack);
            i = global.funStack.pop()
            break
        case "label":
            global.labelArr.push({
                line: i,
                name: commandLineArr[1]
            })
            break
        case "goto":
            for (let j = 0; j < global.labelArr.length; j++) {
                if (global.labelArr[j].name == commandLineArr[1]) {
                    i = global.labelArr[j].line - 1
                }
            }
            break
        default:
            break

    }
    i++

    

    return i
}







/**
 * 对所有数据指令往下执行
 */
const Run = (global) => {




    let allCodeArr = global.codeStr.split("\n")

    // 过滤：去掉空行、全空格行
    allCodeArr = allCodeArr.filter(line => line.trim() !== '');
    for (let i = 0; i < allCodeArr.length; i++) {
        allCodeArr[i] = allCodeArr[i].trim()    // 去除前后空格
    }

    let output = ""



    const stack = [];
    const jump = new Map();
    for (let i = 0; i < allCodeArr.length; i++) {
        const op = allCodeArr[i];
        if (op === "start" || op === "[")
            stack.push(i);
        else if (op === "end" || op === "]") {
            const j = stack.pop();
            jump.set(i, j);
            jump.set(j, i);
        }
    }
    if (stack.length > 0) throw new Error("括号不匹配");





    // 主循环
    let i = 0;
    while (i < allCodeArr.length) {
        let operand = 1; //每一轮重置！
        let argument = ""; //每一轮重置！

        // console.log(`执行第${i}行: ${allCodeArr[i]}`)
        // 爆栈检测
        if (global.funStack.length > 100) {
            console.error("-----调用栈爆炸-----")
            return
        }
        // 把执行的所有命令生成一个文件
        output += allCodeArr[i] + "\n"

        // 清空命令前面的空格
        let commandLineArr = allCodeArr[i].trim().split(" ")
        // console.log("commandLineArr", commandLineArr)
        let command = commandLineArr[0]


        // 有数值计算的操作数赋值为number ，其余赋值为string
        if (command == "add" || command == "push" || command == "sub" || command == "left" || command == "right") {
            operand = parseInt(commandLineArr[1])

            if (commandLineArr.length < 2) {
                operand = 1
            }

        }
        // 增加一种函数调用的方式
        else {
            argument = commandLineArr[1]
        }

        // 增加一种函数调用方式
        if (command.indexOf("()") != -1) {
            argument = command.slice(0, -2);
            command = "run"
        }

        // 增加一种函数定义方式 
        command = command.replace("function", "fun")
        command = command.replace("}", "funEnd")


        // 导入单独处理
        if (command == "import") {
            // 导入其他代码文件
            // 一个文件只能导入一次
            if (!global.imported) {
                const importCode = fs.readFileSync(argument, "utf-8")
                // 执行一遍导入的代码
                allCodeArr = importCode.split("\n").concat(allCodeArr)
                i = 0
                global.imported = true
            }
        }


        // 正常处理单命令
        i = runOneCommand(global, command, commandLineArr, operand, argument, i, allCodeArr, jump)
    }

    console.log(printStr);
    
    return output
}

export { Run }