def bf2c(bf_src: str) -> str:
    # 1. 只保留有效指令
    code = [c for c in bf_src if c in "><+-.,[]"]
    n = len(code)

    # 2. 括号预匹配
    jump = [0] * n
    stack = []
    for idx, op in enumerate(code):
        if op == '[':
            stack.append(idx)
        elif op == ']':
            if not stack:
                raise SyntaxError("括号不匹配，多余 ]")
            left = stack.pop()
            jump[left] = idx
            jump[idx] = left
    if stack:
        raise SyntaxError("括号不匹配，缺少 ]")

    # 3. 输出C模板
    c_lines = [
        "#include <stdio.h>",
        "int main(){",
        "unsigned char tape[30000]={0};",  # BF标准30000字节磁带
        "unsigned char *p = tape;"
    ]

    pc = 0
    while pc < n:
        op = code[pc]
        if op == '>':
            c_lines.append("p++;")
        elif op == '<':
            c_lines.append("p--;")
        elif op == '+':
            c_lines.append("(*p)++;")
        elif op == '-':
            c_lines.append("(*p)--;")
        elif op == '.':
            c_lines.append("putchar(*p);")
        elif op == ',':
            c_lines.append("*p=getchar();")
        elif op == '[':
            # [ : 如果*p==0，goto到配对的]后面
            label_L = f"L{pc}"
            label_R = f"L{jump[pc]}"
            c_lines.append(f"{label_L}: if(!*p) goto {label_R};")
        elif op == ']':
            label_L = f"L{jump[pc]}"
            label_R = f"L{pc}"
            c_lines.append(f"goto {label_L};")
            c_lines.append(f"{label_R}:;")
        pc += 1

    c_lines.append("return 0;}")
    return "\n".join(c_lines)


# 测试
if __name__ == "__main__":
    hello_bf = "++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++."
    c_code = bf2c(hello_bf)
    print(c_code)
    # 保存文件后调用 gcc out.c -o bfprog 即可运行
