const { log } = require('console')
const fs = require('fs')


// 内存初始化
const memory = []
for (let i = 0; i < 100; i++) {
    memory.push(0)
}

let pointer = 0

// 读取程序
let str = fs.readFileSync("./c.x", 'utf-8')

// 维护一个函数表
let funs = []

// 维护一个调用函数的行号
let runLine = 0

let codeArr = str.split("\n")

let output = ""
for (let i = 0; i < codeArr.length; i++) {
    // 把执行的所有命令生成一个文件
    output += codeArr[i] + "\n"

    // 清空命令前面的空格
    let commandArr = codeArr[i].split(" ")

    let command = commandArr[0]



    let data

    if (command != "run" && command != "fun" && command != "log") {
        data = parseInt(commandArr[1])
    }
    else {
        data = (commandArr[1])
    }

    // console.log(`进入指令 ${command}`);



    // 根据命令进行对应处理
    switch (command) {
        case "push":
            memory[pointer] = data
            break;
        case "print":
            console.log(memory[pointer]);
            break
        case "log":
            console.log(data)
        case "start":
            // 判断程序是否为0，为零则跳到下一个 end处， 不为零则直接往后走
            if (memory[pointer] === 0) {
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
            memory[pointer] += data
            break;
        case "sub":
            memory[pointer] -= data
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
                name: data,
                startLine: i + 1,
                endLine: endLine
            })
            i = endLine

            break;
        case "run":
            // 调用函数
            runLine = i
            for (let j = 0; j < funs.length; j++) {
                if (funs[j].name === data) {
                    // 执行函数内部的代码
                    i = funs[j].startLine
                }
            }
            break;
        case "funEnd":
            // 函数调用结束，回到调用点
            i = runLine
            break
        default:
            break
    }


}

console.log(
    "内存", memory);
fs.writeFileSync("code.y", output, "utf-8")


console.log(pointer);