
import fs from 'fs';
import { Run } from "./js/Run.js"
import { ToBrainFuck } from './js/toBF.js';
import { log } from 'console';
import util from 'util'
import {printMemTable} from "./js/tools.js"

let args = process.argv.slice(2)


let codeStr = fs.readFileSync("./src/runtime.bf1", 'utf-8')



const m1 = new Array(
)
const m2 = new Array()
for (let i = 0; i < 20000; i++) {
    // vm2 会将运行的代码写入vm1解释器内存之中，然后运行唯一的解释器代码vm1
    // 用数字代表知道
    m1.push(0)
    m2.push(0)
}

let global = {
    imported: false,  // 是否导入过
    funs: [],     // 函数表，全局变量
    funStack: [],    //函数调用栈
    loopStack: [],  // 循环栈
    labelArr: [],   // goto标记
    pointer: 0,
    codeStr: codeStr,
    memory: m1
}








// 字符映射表
const bfMap = {
    '>': 1,
    '<': 2,
    '+': 3,
    '-': 4,
    '[': 5,
    ']': 6,
    '.': 7,
    ',': 8
};



// 这是输入的真正bf，仅支持bf语言
let codeStr2 = fs.readFileSync(args[0], 'utf-8')

let global_2 = {
    imported: false,  // 是否导入过
    funs: [],     // 函数表，全局变量
    funStack: [],    //函数调用栈
    loopStack: [],  // 循环栈
    labelArr: [],   // goto标记
    pointer: 0,
    codeStr: codeStr2,
    memory: m2
}



// let codeStr2BF=""
let codeStr2BF = ToBrainFuck(Run(global_2))






let progIdx = 0; // L2程序缓冲区下标，从0开始，对应内存10+progIdx
for (let i = 0; i < codeStr2BF.length; i++) {
    const ch = codeStr2BF[i];
    const op = bfMap[ch];
    if (op === undefined) {
        // 空格、换行、注释，直接跳过
        continue;
    }
    global.memory[20 + progIdx] = op;
    progIdx++;
}

// 把程序总长度存入全局变量区 地址3
global.memory[0] = progIdx;

console.log(codeStr2BF);



Run(global)


console.log(
    "内存",)

console.log("0号，指令长度，1号，指令计数器pc,3号，虚拟指针--- ，从10号开始，是虚拟指令");
console.log("4号，是虚拟指令临时，5-9是缓冲区");







printMemTable(global)


