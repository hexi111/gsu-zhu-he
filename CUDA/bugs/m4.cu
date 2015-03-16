#include <stdio.h> 
#include <stdlib.h>

#define SIZE 1000

__global__ void demo(int * p){
	int tx=threadIdx.x;
	int bx=blockIdx.x;
	int thid = tx+bx*blockDim.x;
	// Some of the threads try to access memory out of array boundary. 
	// The program may not get any error message, but will pose a potential bug. 
	p[thid]=thid+p[thid];
}
int main(int argc , char **argv){
	int * p_cpu;
	int * p_gpu;
	
	cudaError_t err;
	err=cudaMalloc((void**)&p_gpu,SIZE*sizeof(int));
	if( err != cudaSuccess)
	{
    	printf("CUDA error: %s\n", cudaGetErrorString(err));
     	exit(-1);
	}
	p_cpu=(int *)malloc(SIZE*sizeof(int));

	int i;
	for(i=0;i<SIZE;i++){
		p_cpu[i]=1;	
	}
	
	err=cudaMemcpy( p_gpu, p_cpu, sizeof(int)*SIZE, cudaMemcpyHostToDevice);
	if( err != cudaSuccess)
	{
    	printf("CUDA error: %s\n", cudaGetErrorString(err));
     	exit(-1);
	}
	dim3 dimGrid((SIZE-1)/512+1,1);
	dim3 dimBlock(512,1);
	demo<<<dimGrid,dimBlock>>>(p_gpu);
	free(p_cpu);
	err=cudaFree(p_gpu);
	if( err != cudaSuccess)
	{
    	printf("CUDA error: %s\n", cudaGetErrorString(err));
     	exit(-1);
	}
    return 0;
}
