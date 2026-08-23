/**
 * 打印内存前100单元，左对齐，表头严格匹配宽度，打印附加指针箭头，不改动原始内存
 * @param {{memory: number[], pointer: number}} ctx
 */
function printMemTable(ctx) {
    const { memory, pointer } = ctx;
    const size = 100;
    const data = memory.slice(0, size);

    console.log("\n====内存前100单元 | ptr:" + pointer + "====");

    //表头：地址6字符，每列5字符，10列
    let head = "地址".padEnd(4, " ");
    for (let i = 0; i < 10; i++) {
        head += String(i).padEnd(5, " ");
    }
    //总长度 =6 +10*5 =56
    console.log(head);
    console.log("-".repeat(56));

    //内容行
    for (let row = 0; row < 10; row++) {
        const offset = row * 10;
        let line = String(offset).padEnd(6, " ");

        for (let col = 0; col < 10; col++) {
            const idx = offset + col;
            let valStr = String(data[idx]);
            if (idx === pointer) {
                valStr += "<";
            }
            line += valStr.padEnd(5, " ");
        }
        console.log(line);
    }
}


export {printMemTable}