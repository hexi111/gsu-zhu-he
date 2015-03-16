#include <stdio.h> 
#include <stdlib.h>

#define NUMBER 100

__global__ void demo(int *arr){
    if(threadIdx.x<NUMBER){
      for(int i=0;i<NUMBER;i++){
        arr[threadIdx.x]= arr[threadIdx.x]+threadIdx.x;
        __syncthreads();
       }
    }
}
int main(int argc , char **argv){
	int * arr;
	cudaError_t err;
	err=cudaMalloc((void**)&arr,NUMBER*sizeof(int));
	if( err != cudaSuccess){
    	printf("CUDA error: %s\n", cudaGetErrorString(err));
     	exit(-1);
	}	
	dim3 dimGrid(1,1);
	dim3 dimBlock(512,1);
	demo<<<dimGrid,dimBlock>>>(arr);
	err=cudaFree(arr);
	if( err != cudaSuccess){
    	printf("CUDA error: %s\n", cudaGetErrorString(err));
     	exit(-1);
	}
    return 0;
}
