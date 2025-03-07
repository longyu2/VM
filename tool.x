

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



// 将一个数复制到右边，自身不变
fun copyR 
---------------------------------------
// 这一段将一个数移动到其右边两个格

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






fun AddR
---------------------------------------
// 将当前指针所指的数据与右侧相加，结果写入当前区域
right

start

sub 1
left
add 1
right

end

left

funEnd
---------------------------------------



