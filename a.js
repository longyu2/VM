const { log } = require('console')
const fs = require('fs')
const { encode } = require('punycode')

const args = process.argv.slice(2)


// 内存初始化
const memory = []
for (let i = 0; i < 100; i++) {
    memory.push(0)
}

let pointer = 0
let funs = []       // 函数表，全局变量


const Run = (codeStr) => {
    // 维护一个函数表


    // 维护一个调用函数的行号
    let runLine = 0

    let codeArr = codeStr.split("\n")

    let output = ""


    for (let i = 0; i < codeArr.length; i++) {
        // 把执行的所有命令生成一个文件
        output += codeArr[i] + "\n"

        // 清空命令前面的空格
        let commandArr = codeArr[i].split(" ")

        let command = commandArr[0]



        let operand

        // 有数值计算的操作数赋值为number ，其余赋值为string
        if (command != "run" && command != "fun" && command != "log" && command != "import") {
            operand = parseInt(commandArr[1])
        }
        else {
            operand = commandArr[1]
        }




        // console.log(`进入指令 ${command}`);



        // 根据命令进行对应处理
        switch (command) {
            case "push":
                memory[pointer] = operand
                break;
            case "print":
                console.log(memory[pointer]);
                break
            case "log":
                console.log(operand)
            case "start":
                // 判断程序是否为0，为零则跳到下一个 end处， 不为零则直接往后走
                if (memory[pointer] <= 0) {
                    // 往后查询第一个end
                    let temp = ""
                    while (temp != "end") {
                        i++
                        temp = codeArr[i].split(" ")[0]
                    }
                }

                break

            case "end":
                // 跳转到上一个start处

                let temp = ""
                while (temp != "start") {
                    i--
                    temp = codeArr[i].split(" ")[0]
                }

                i--

                break

            case "add":
                operand = (operand === undefined || operand === null) ? 1 : operand
                memory[pointer] += operand
                break;
            case "sub":
                memory[pointer] -= operand
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
                let funData = []

                // 将函数的所有内容添加进函数表
                for (let j = i + 1; j < endLine; j++) {

                    funData.push(codeArr[j])

                }
                funs.push({
                    name: operand,
                    "funData": funData
                })

                i = endLine // 结束函数的定义部分

                break;
            case "run":
                const fun = funs.find((fun) => fun.name === operand);
                Run(fun.funData.join("\n"))
                break;
            case "funEnd":

                break
            case "import":
                // 导入其他代码文件
                const importCode = fs.readFileSync(operand, encoding = "utf-8")

                // 执行一遍导入的代码
                Run(importCode)

                break
            default:
                break
        }


    }



    fs.writeFileSync("code.y", output, "utf-8")


}


let codeStr = fs.readFileSync(args[0], 'utf-8')


Run(codeStr)
console.log("指针位置：", pointer);

console.log(
    "内存", memory.slice(0,10));




