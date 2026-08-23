let a = 5
let arr = [{ value: 5, end: false }]
let result = 1


// 栈为空则所有任务停止
while (arr.length > 0) {

    // 取栈顶
    let current = arr.pop()
    // 栈顶不大于1则说明已到达最深
    if (current.value > 1) {

        if (current.end) {
            // 栈顶任务若完成，取栈顶结果
            result *= current.value
        }
        else {
            // 若栈顶任务没有调用完成，就推回栈顶，并调用子项
            arr.push({ value: current.value, end: true })
            arr.push({ value: current.value - 1, end: false })
        }
    }


}





