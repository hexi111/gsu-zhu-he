#include <stdio.h> 
#include <stdlib.h>

#define SIZE 512

// This example is adapted from an example in Nvidia CUDA C Programming Guide 4.0

__global__ void demo(int * input,int* output) {
	int tid = threadIdx.x;
	int ref1 = input[tid];
	//These two syncthreads call can make sure memoey coherence. 
	//__syncthreads();
	input[tid + 1] = 2;
	//__syncthreads();
	int ref2 = input[tid];
	output[tid] = ref1 * ref2;
}
int main(int argc , char **argv){
	cudaError_t err;
	int * input;
	err=cudaMalloc((void**)&input,(SIZE+1)*sizeof(int));
	if( err != cudaSuccess)
	{
    	printf("CUDA error: %s\n", cudaGetErrorString(err));
     	exit(-1);
	}
	int * output;
	err=cudaMalloc((void**)&output,SIZE*sizeof(int));
	if( err != cudaSuccess)
	{
    	printf("CUDA error: %s\n", cudaGetErrorString(err));
     	exit(-1);
	}
	int * temp;
	temp=(int *)malloc((SIZE+1)*sizeof(int));
	int i;
	for(i=0;i<(SIZE+1);i++){
		temp[i]=1;
	}
	err=cudaMemcpy( input, temp, sizeof(int)*(SIZE+1), cudaMemcpyHostToDevice);
	if( err != cudaSuccess)
	{
    	printf("CUDA error: %s\n", cudaGetErrorString(err));
     	exit(-1);
	}
	dim3 dimGrid(1,1);
	dim3 dimBlock(SIZE,1);
	demo<<<dimGrid,dimBlock>>>(input,output);
	err=cudaMemcpy( temp, output, sizeof(int)*(SIZE), cudaMemcpyDeviceToHost);
	if( err != cudaSuccess)
	{
    	printf("CUDA error: %s\n", cudaGetErrorString(err));
     	exit(-1);
	}
	for(i=0;i<SIZE;i++){
		printf("%dth element is %d\n",i,temp[i]);
	}
	free(temp);
	err=cudaFree(input);
	if( err != cudaSuccess)
	{
    	printf("CUDA error: %s\n", cudaGetErrorString(err));
     	exit(-1);
	}
	err=cudaFree(output);
	if( err != cudaSuccess)
	{
    	printf("CUDA error: %s\n", cudaGetErrorString(err));
     	exit(-1);
	}
    return 0;
}
