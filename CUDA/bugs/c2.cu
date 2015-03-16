#include <stdio.h> 
#include <stdlib.h>

#define THREADSIZE 100
#define BLOCKSIZE 65536

__global__ void demo(int * p){
	int tx=threadIdx.x;
	int bx=blockIdx.x;
	int thid = tx+bx*blockDim.x;
	p[thid]=thid;
	if(thid<10){
		printf("%d elements is %d\n",thid,p[thid]);
	}
}
int main(int argc , char **argv){
	int * p;
	cudaError_t err;
	err=cudaMalloc((void**)&p,THREADSIZE*BLOCKSIZE*sizeof(int));
	if( err != cudaSuccess)
	{
    	printf("CUDA error: %s\n", cudaGetErrorString(err));
     	exit(-1);
	}
	dim3 dimGrid(BLOCKSIZE,1);
	dim3 dimBlock(THREADSIZE,1);
	// Configuration is not correct.
	// x, y, z dimension of thread blocks should not exceed 65535 in compute capability 2.0
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
