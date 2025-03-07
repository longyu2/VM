// 函数设计原则，函数运行完，指针位置不变


// 将一个数移动到其右边l格

fun moveR
-------------------------------
start 
sub 1
right
add 1
left
end
---------------------------------------
funEnd


// 将一个数移动到其左边2格

fun moveL2
-------------------------------
start 
sub 1
left
left
add 1
right
right
end
---------------------------------------
funEnd


// 将一个数复制到右边，自身不变
fun copyR 
---------------------------------------
// 这一段将一个数复制到其右边两个格并删除自身，
// 这里必须写0不然有值的话会污染copyR
right 
push 0 
right
push 0
left
left


start 
sub 1
right
add 1
right
add 1

left
left
end

// 这一段将第三格移动到第一格
right
right

run moveL2

left
left

funEnd
---------------------------------------






fun AddR
---------------------------------------
// 将当前指针所指的数据与右侧相加，结果写入当前区域
right
run copyR
right

start

sub 1
left
left
add 1
right
right
end

left
left

funEnd
---------------------------------------



fun mul
----

// 将指针值和右边一值相乘到第三格保存，指针不变
sub 1

right


run copyR

left

start


right
run AddR
left
sub 1
end

left


----
funEnd