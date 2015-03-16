#include <stdio.h> 
#include <stdlib.h>

#define SIZE 10

__global__ void demo(int * p){
	int tx=threadIdx.x;
	// Trying to access variables allocated on main memory in a kernel function is illegal. 
	p[tx]=tx+p[tx];
}
int main(int argc , char **argv){
	int * p;
	p=(int *)malloc(10*sizeof(int));
	int i;
	for(i=0;i<SIZE;i++){
		p[i]=1;	
	}
	dim3 dimGrid(1,1);
	dim3 dimBlock(SIZE,1);
	demo<<<dimGrid,dimBlock>>>(p);
	for(i=0;i<SIZE;i++){
		printf("p[%d]=%d\n",i,p[i]);		
	}
	free(p);
    return 0;
}
