内存空间，一个长纸带或者数组，可以放一个十进制int数


指令集 ：

所有的指令可以携带参数或者不携带

push 往内存中写数

print：将当前内容输出到命令行

jump，成对出现，当指针为0，跳过区域，不为零，执行区域

go 去到某个地址

add 将当前指针内容增加数据

sub 将当前指针内容减去

funS 函数，或者说宏定义，执行fun里的一段代码

如此，也就基本实现了图灵完备
