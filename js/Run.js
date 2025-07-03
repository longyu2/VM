import fs from "fs"
/**
 * 单指令的处理方式
 */
const runCommand = (global,command,commandLineArr,operand,i,allCodeArr) => {
    switch (command) {
        case "push":
            global.memory[global.pointer] = operand
            break;
        case "print":
            console.log(String.fromCharCode(global.memory[global.pointer]));
            break
        case "start":
            global.loopStack.push(i)
            // 判断程序是否为0，为零则跳到下一个 end的下一条， 不为零往下执行
            if (global.memory[global.pointer] === 0) {
                // 往后查询第一个end
                let temp = ""
                let depth = 1
                i++
                while (depth > 0) {
                    temp = allCodeArr[i].split(" ")[0]
                    // console.log("循环查找到行", i);

                    if (temp == "start") {
                        // 如果遇到内部嵌套循环，增加深度
                        global.loopStack.push(i)
                        depth++
                    }

                    if (temp == "end") {
                        // 出栈顶
                        global.loopStack.pop()
                        depth--
                    }

                    i++

                    // console.log(global.loopStack);

                }

            }
            break
        case "end":
            // 调到栈顶stack
            i = global.loopStack.pop() - 1
            break
        case "add":
            operand = (operand === undefined || operand === null) ? 1 : operand
            global.memory[global.pointer] += operand
            break;
        case "left":
            global.pointer--
            break;
        case "right":
            global.pointer++
            break;
        case "fun":
            // 函数或者 说宏定义，是最为关键的一环，它可以定义自己的代码，简化冗余
            let endLine = i
            // 寻找函数尾
            while (allCodeArr[endLine] != "funEnd" && allCodeArr[endLine] != "}") {
                endLine++
            }
            global.funs.push({
                name: commandLineArr[1],
                startLine: i,
                endLine: endLine,
            })

            i = endLine // 结束函数的定义部分
            break;
        case "run":
            global.funStack.push(i)    // 把调用点存到调用栈
            const fun = global.funs.find((fun) => fun.name === operand);   // 查找函数表
            console.log(fun);
            i = fun.startLine
            break;
        case "funEnd":
            console.log(global.funStack);
            // 读到函数结束时，查找函数栈顶的行号，此处是调用点
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

    return i

}







/**
 * 对所有数据指令往下执行
 */
const Run = (global) => {
    let allCodeArr = global.codeStr.split("\n")
    let output = ""

    // 主循环
    for (let i = 0; i < allCodeArr.length; i++) {
        allCodeArr[i] = allCodeArr[i].trim()    // 去除前后空格

        // 爆栈检测
        if (global.funStack.length > 100) {
            console.error("-----调用栈爆炸-----")
            return
        }
        // 把执行的所有命令生成一个文件
        output += allCodeArr[i] + "\n"

        // 清空命令前面的空格
        let commandLineArr = allCodeArr[i].split(" ")
        let command = commandLineArr[0]
        let operand

        // 有数值计算的操作数赋值为number ，其余赋值为string
        if (command == "add" || command == "push"  || command == "sub") {
            operand = parseInt(commandLineArr[1])
        }
        // 增加一种函数调用的方式
        else {
            operand = commandLineArr[1]
        }

        // 增加一种函数调用方式
        if (command.indexOf("()") != -1) {
            operand = command.slice(0, -2);
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
                const importCode = fs.readFileSync(operand, "utf-8")
                // 执行一遍导入的代码
                allCodeArr = importCode.split("\n").concat(allCodeArr)
                i = 0
                global.imported = true
            }
        }


        // 正常处理单命令
        i = runCommand(global,command,commandLineArr,operand,i,allCodeArr)
    }

    // fs.writeFileSync("output.x", output, "utf-8")
    console.log("指针位置：", global.pointer);
    global.memory[global.pointer] += " <"
    console.log(
        "内存", global.memory.slice(0, 200));
}




export { Run }