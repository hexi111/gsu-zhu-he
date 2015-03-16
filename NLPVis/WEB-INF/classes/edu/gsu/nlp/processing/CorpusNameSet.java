package edu.gsu.nlp.processing;

import java.util.List;
import java.util.ArrayList;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;

public class CorpusNameSet{
	
	private List<String> nameSet;
	
	public CorpusNameSet(String path) throws IOException{
		//System.out.println("Testing");
		nameSet=new ArrayList<String>();
		BufferedReader is = new BufferedReader(new FileReader(path));
		String str=is.readLine();
		//System.out.println("str="+str);
		while(str!=null){
			nameSet.add(str);
			str=is.readLine();
			//System.out.println("str="+str);
		}
		is.close();
	}
	
	public void addCorpusName(String name){
		nameSet.add(name);
	}
	
	public List<String> getNameSet(){
		return this.nameSet;
	}
	
	public void cleanup(String path) throws IOException{
		BufferedWriter is=new BufferedWriter(new FileWriter(path));
		for(String name:nameSet){
			is.write(name);
			is.newLine();
		}
		is.close();
	}
	
}