// bf to c 直接用 goto 偷懒得了
// 在c里面构造一个内存数组
import fs from "fs";



let codeCStr = ""

codeCStr += `
#include<stdio.h>
#include<stdint.h>
#include<stdlib.h>
int memorySize = 30000;
char *ptr ;







int main(int argc, char **argv){
   ptr = (char *) malloc(memorySize);
   char*base = ptr;
   // 初始化内存为0

   if(ptr == NULL){
    perror("malloc fail");
    return 1;
    }

    for(int i = 0; i < memorySize; i++){
        *(ptr + i) = 0;
    }
    int ch ;




    FILE *inputs = fopen(argv[1],"rb");
    
    //然后fgetc(f)读取字节
`



const bfCode = fs.readFileSync(process.argv[2], "utf-8");


const loopStack = [];
const jump = new Map();

for (let i = 0; i < bfCode.length; i++) {
    if (bfCode[i] === '[') {
        loopStack.push(i);
    } else if (bfCode[i] === ']') {
        if (loopStack.length === 0) {
            throw new Error("Unmatched ']' at position " + i);
        }

        const j = loopStack.pop();
        jump.set(i, j);
        jump.set(j, i);
    }

}

// console.log(jump)



for (let i = 0; i < bfCode.length; i++) {
    switch (bfCode[i]) {
        case '>':
            codeCStr += `
             if(ptr < base + memorySize-1 ){
            ptr++;\n
    }
            `;
            break;
        case '<':
            codeCStr += `
            if (ptr > base) {
             ptr--;\n
            }
           
            `;
            break;
        case '+':
            codeCStr += `
           
            (*ptr)++;\n
            
            `;
            break;
        case '-':
            codeCStr += `(*ptr)--;\n`;
            break;
        case '.':
            codeCStr += `printf("%c", *ptr);\n`;
            break;
        case ',':
            codeCStr += `
           
            ch = fgetc(inputs);
            if(ch == EOF){
                *ptr = 0;
            }else{
                *ptr = (unsigned char)ch;
}
            
            `;
            break;
        case '[':

            codeCStr += `
            label${i}:\n
            if (*ptr == 0) {\n
                goto label${jump.get(i)};\n
            }`;
            break;
        case ']':

            codeCStr += `
            label${i}:\n
            if (*ptr != 0) {\n
                goto label${jump.get(i)};\n
            }`;
            break;
    }
}




codeCStr += `

fclose(inputs);
free(base);
}`

console.log(process.argv[3])
fs.writeFileSync(process.argv[3], codeCStr, "utf-8");
