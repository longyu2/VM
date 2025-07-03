
import ./src/tool.x

// 歪打正着，搞定了0加到100
// 原理：copyR 是将当前数移动到第二格，第三格，然后把第三格移动到第一格，移动到第二格的时候采用加法，如果此时第二格有值则累加


// push 100
// start
// run copyR

// add -1
// end

// 以上是利用copyR 的bug写的累加，已经弃用
// 已经修复利用copyR的bug实现的累加，重新编写新的累加(利用了addR函数)

right
push 200
left


right
 
start

left
AddR()

right 
add -1


end

