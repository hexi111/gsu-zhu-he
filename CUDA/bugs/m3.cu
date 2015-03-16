#include <stdio.h> 
#include <stdlib.h>

int main(int argc , char **argv){
	size_t mem_tot = 0;
	size_t mem_free = 0;
	cudaMemGetInfo (&mem_free, &mem_tot);
	printf("total memory %ld bytes, free memory %ld bytes\n", (long) mem_tot, (long) mem_free );
	int * p;
	long size=1024*1024;
	size*=1024*2;
	printf("size=%ld\n",size);
	cudaError_t err;
	err=cudaMalloc((void**)&p,size*sizeof(int));;	
	// Need to catch the exception from GPU side.
	if( err != cudaSuccess)
	{
    	printf("CUDA error: %s\n", cudaGetErrorString(err));
     	exit(-1);
	}
	cudaMemGetInfo (&mem_free, &mem_tot);
	printf("total memory %ld bytes, free memory %ld bytes\n", (long) mem_tot, (long) mem_free );
}
