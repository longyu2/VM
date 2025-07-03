const { log } = require('console')
const fs = require('fs')
const { run } = require('node:test')
const { encode } = require('punycode')


let args = process.argv.slice(2)



// 内存初始化
const memory = []
for (let i = 0; i < 100; i++) {
    memory.push(0)
}

let imported = false    // 是否导入过
let pointer = 0
let funs = []       // 函数表，全局变量
let funStack = []   //函数调用栈
let brainFuckStr = ""

let loopStack = []  // 循环栈

const Run = (codeStr) => {

    let codeArr = codeStr.split("\n")

    let output = ""

    for (let i = 0; i < codeArr.length; i++) {
        // 根据命令进行对应处理
        let command = codeArr[i].split(" ")[0]
        // 将其输出为对应的brainFuck程序
        let co = [
            "print", "start", "end", "add", "sub", "left", "right"
        ]
        let co2 = [
            ".", "[", "]", "+", "-", "<", ">"
        ]

        if (command == "push") {
            for (let j = 0; j < codeArr[i].split(" ")[1]; j++) {
                brainFuckStr += "+"

            }
        }





        for (let j = 0; j < co.length; j++) {
            if (command == co[j]) {

                if (command == "add") {
                    if (codeArr[i].split(" ")[1] == "-1") {
                        brainFuckStr += ("-")
                    }
                    else {
                        brainFuckStr += ("+")
                    }
                }
                else {
                    brainFuckStr += co2[j]
                }
            }

        }
    }



    for (let i = 0; i < codeArr.length; i++) {

        // 爆栈检测
        if (funStack.length > 100) {
            console.error("-----调用栈爆炸-----")
            return
        }



        // 把执行的所有命令生成一个文件
        output += codeArr[i] + "\n"

        // 清空命令前面的空格
        let commandArr = codeArr[i].split(" ")

        let command = commandArr[0]

        let operand

        let operand2

        // 有数值计算的操作数赋值为number ，其余赋值为string
        if (command != "run" && command != "fun" && command != "log" && command != "import") {
            operand = parseInt(commandArr[1])
        }

        // 增加一种函数调用的方式
        else {
            operand = commandArr[1]
            if (commandArr.length > 2) {
                operand2 = commandArr[2]
            }

        }
        if (command.indexOf("()") != -1) {
            operand = command.slice(0, -2);
            command = "run"
        }


        switch (command) {
            case "push":
                memory[pointer] = operand
                break;
            case "print":

                console.log(String.fromCharCode(memory[pointer]));
                break
            case "start":
                loopStack.push(i)
                // console.log("栈", loopStack);
                // console.log(
                //     "内存", memory.slice(0, 20));
                // console.log("指针位置：", pointer);

                // 判断程序是否为0，为零则跳到下一个 end的下一条， 不为零往下执行
                if (memory[pointer] === 0) {
                    // 往后查询第一个end
                    let temp = ""
                    let depth = 1
                    i++
                    while (depth > 0) {
                        temp = codeArr[i].split(" ")[0]
                        // console.log("循环查找到行", i);

                        if (temp == "start") {
                            // 如果遇到内部嵌套循环，增加深度
                            loopStack.push(i)
                            depth++
                        }

                        if (temp == "end") {
                            // 出栈顶
                            loopStack.pop()
                            depth--
                        }

                        i++

                        // console.log(loopStack);

                    }

                }

                break

            case "end":
                // 调到栈顶stack
                i = loopStack.pop() - 1
                break

            case "add":
                operand = (operand === undefined || operand === null) ? 1 : operand
                memory[pointer] += operand
                break;
            case "left":

                pointer--
                break;
            case "right":
                pointer++
                break;
            case "fun":
                // 函数或者 说宏定义，是最为关键的一环，它可以定义自己的代码，简化冗余
                let endLine = i
                // 寻找函数尾
                while (codeArr[endLine] != "funEnd") {
                    endLine++
                }
                funs.push({
                    name: operand,
                    startLine: i + 1,
                    endLine: endLine
                })

                i = endLine // 结束函数的定义部分

                break;
            case "run":
                funStack.push(i)    // 把调用点存到调用栈
                const fun = funs.find((fun) => fun.name === operand);
                i = fun.startLine
                break;
            case "funEnd":
                // 读到函数结束时，查找函数栈顶的行号，此处是调用点
                i = funStack.pop()
                break
            case "import":
                // 导入其他代码文件
                // 一个文件只能导入一次
                if (!imported) {
                    const importCode = fs.readFileSync(operand, encoding = "utf-8")

                    // 执行一遍导入的代码
                    codeArr = importCode.split("\n").concat(codeArr)
                    i = 0
                    imported = true
                }


                break
            default:
                break
        }


    }



    fs.writeFileSync("output.x", output, "utf-8")



}


let codeStr = fs.readFileSync(args[0], 'utf-8')


Run(codeStr)
console.log("指针位置：", pointer);
memory[pointer] += " <"

console.log(
    "内存", memory.slice(0, 200));
fs.writeFileSync("brainfuck.bf", brainFuckStr, "utf8")



