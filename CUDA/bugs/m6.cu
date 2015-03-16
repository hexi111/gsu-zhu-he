#include <stdio.h> 
#include <stdlib.h>

#define SIZE 10

int main(int argc , char **argv){

	int * p;
	cudaError_t err;
	// Should be cudaMalloc((void**)&p,SIZE*sizeof(int))
	err=cudaMalloc((void**)&p,SIZE);
	if( err != cudaSuccess)
	{
    	printf("CUDA error: %s\n", cudaGetErrorString(err));
     	exit(-1);
	}
	cudaFree(p);
    return 0;
}
