#include <stdio.h> 
#include <stdlib.h>

#define SIZE 2000

__global__ void demo(int * p){
	int tx=threadIdx.x;
	printf("tx=%d\n",tx);
	p[tx]=tx;
}
int main(int argc , char **argv){
	int * p;
	cudaError_t err;
	err=cudaMalloc((void**)&p,SIZE*sizeof(int));
	if( err != cudaSuccess)
	{
    	printf("CUDA error: %s\n", cudaGetErrorString(err));
     	exit(-1);
	}
	dim3 dimGrid(1,1);
	dim3 dimBlock(SIZE,1);
	// Configuration too many thread in a thread block.
	demo<<<dimGrid,dimBlock>>>(p);
	err=cudaFree(p);
	if( err != cudaSuccess)
	{
    	printf("CUDA error: %s\n", cudaGetErrorString(err));
     	exit(-1);
	}   
	printf("tx\n");
 
	return 0;
}
