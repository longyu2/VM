import fs from "fs"
const ToBrainFuck = (codeStr) => {
    let brainFuckStr = ""
   
    let codeArr = codeStr.split("\n")
    let co = [
        "print", "start", "end", "add", "sub", "left", "right"
    ]
    let co2 = [
        ".", "[", "]", "+", "-", "<", ">"
    ]
    // 处理brainFuck部分
    for (let i = 0; i < codeArr.length; i++) {
        codeArr[i] = codeArr[i].trim()    // 去除前后空格

        // 根据命令进行对应处理
        let command = codeArr[i].split(" ")[0]
        // 将其输出为对应的brainFuck程序


        if (command == "push") {
            for (let j = 0; j < codeArr[i].split(" ")[1]; j++) {
                brainFuckStr += "+"

            }
        }
        // 处理brainFuck部分
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

    fs.writeFileSync("brainfuck.bf", brainFuckStr, "utf8")
}

export {ToBrainFuck}