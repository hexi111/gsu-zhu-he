package edu.gsu.nlp.processing;

import java.util.ArrayList;

public class SentenceStr {

	private String id;
	private String structure;
	private String name;
	private int value = 0 ;
	private ArrayList <WordPair> types=new ArrayList <WordPair>();
	//private ArrayList <FreqPair> freqs=new ArrayList <FreqPair>();

	public SentenceStr(){
	}
	
	public SentenceStr(String id, String structure, String name, int value){
		this.id=id;
		this.structure=structure;
		this.name=name;
		this.value=value;
	}

	public String getId(){
		return id;
	}
	
	public void setId(String id){
		this.id=id;
	}
	
	public String getStructure(){
		return this.structure;
	}
	
	public void setStructure(String structure){
		this.structure=structure;
	}
	
	public String getName(){
		return this.name;
	}
	
	public void setName(String name){
		this.name=name;
	}
	
	public int getValue(){
		return value;
	}
	
	public void setValue(int value){
		this.value=value;
	}
	
	public ArrayList <WordPair> getTypes(){
		return this.types;
	}
	
	public void addTypes(WordPair w){
		types.add(w);
	}
	/*
	public ArrayList <FreqPair> getFreqs(){
		return this.freqs;
	}
	
	public void addFreqs(FreqPair w){
		freqs.add(w);
	}
	*/
}