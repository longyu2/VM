import fs from "fs"




const bfToVM = (codeStr) => {

    codeStr = codeStr.replaceAll("\n", "")
    
    codeStr = codeStr.split("")
    // console.log( codeStr.length)

    const endArr = []
    for (let i = 0; i < codeStr.length; i++) {
        const command = codeStr[i]
        switch (command) {
            case ".":
                endArr.push("print")
                break
            case ",":
                endArr.push("input")
                break
            case "+":
                endArr.push("add 1")
                break
            case "-":
                endArr.push("add -1")
                break
            case ">":
                endArr.push("right")
                break
            case "<":
                endArr.push("left")
                break
            case "[":
                endArr.push("start")
                break
            case "]":
                endArr.push("end")
                break
        }       
        
    }
    const vmCode = endArr.join("\n")
    return vmCode   
}





export { bfToVM }