
import fs from 'fs';
import {Run} from "./js/Run.js"
let args = process.argv.slice(2)
import util from 'util'
import {printMemTable} from "./js/tools.js"
import { ToBrainFuck } from './js/toBF.js';
import { bfToVM } from './js/t.js';

// 内存初始
const memory = new Uint8Array(100000);





let codeStr = fs.readFileSync(args[0], 'utf-8')

codeStr = bfToVM(codeStr)
let  global= {
    imported: false,  // 是否导入过
    funs: [],     // 函数表，全局变量
    funStack: [],    //函数调用栈
    loopStack: [],  // 循环栈
    labelArr: [],   // goto标记
    pointer: 50000,
    codeStr:codeStr,
    memory:memory,
}
let output = Run(global)




printMemTable(global)









