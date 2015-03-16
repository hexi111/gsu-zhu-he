#include <stdio.h> 
#include <stdlib.h>

#define NUMBER 512

__global__ void reduction(int *arr,int num){
	int tx=threadIdx.x;
	int round=1;
	arr[tx]=1;
	__syncthreads();	
	while(round<NUMBER){
		if((tx%round==0)&&((tx+round)<NUMBER)){
			arr[tx]=arr[tx+round]+arr[tx];
			__syncthreads();
		}
		round=round<<1;
		//__syncthreads();
	}
	if(tx==0){
		printf("Sum of the array is %d\n",arr[0]);
	}
}
int main(int argc , char **argv){
	int * arr;
	cudaError_t err;
	err=cudaMalloc((void**)&arr,NUMBER*sizeof(int));
	if( err != cudaSuccess)
	{
    	printf("CUDA error: %s\n", cudaGetErrorString(err));
     	exit(-1);
	}	
	dim3 dimGrid(1,1);
	dim3 dimBlock(NUMBER,1);
	reduction<<<dimGrid,dimBlock>>>(arr,NUMBER);
	err=cudaFree(arr);
	if( err != cudaSuccess)
	{
    	printf("CUDA error: %s\n", cudaGetErrorString(err));
     	exit(-1);
	}
    return 0;
}
