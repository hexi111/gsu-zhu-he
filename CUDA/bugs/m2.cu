#include <stdio.h> 
#include <stdlib.h>

#define SIZE 10

int main(int argc , char **argv){

	int * p;
	cudaError_t err;
	err=cudaMalloc((void**)&p,SIZE*sizeof(int));
	if( err != cudaSuccess)
	{
    	printf("CUDA error: %s\n", cudaGetErrorString(err));
     	exit(-1);
	}
	int i;
	for(i=0;i<SIZE;i++){
		//Accessing variables allocated on global memory in host function causes Segmentation fault.
		p[i]=1;	
	}
	cudaFree(p);
    return 0;
}
