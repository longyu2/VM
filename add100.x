
import tool.x

// 歪打正着，搞定了0加到100
// 原理：copyR 是将当前数移动到第二格，第三格，然后把第三格移动到第一格，移动到第二格的时候采用加法，如果此时第二格有值则累加

push 100
start
run copyR

sub 1
end

right
right
right

// 此时指针第四个

push 100
right
push 100
left



// 100x100  跟1加到99异曲同工，不过只需要多一格存储100
start
sub 1

right
run copyR
left

end










 




