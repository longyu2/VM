#include"stdio.h"
#include"stdlib.h"

int * pointer ;

void init(int* pointer,int length){
    for (int i = 0; i < length; i++)
    {
        *(pointer+i) = 0;
    }
}

void printMemory(int* pointer,int length){
    
}

int main (){
    
    pointer = (int*) malloc(1000);
}