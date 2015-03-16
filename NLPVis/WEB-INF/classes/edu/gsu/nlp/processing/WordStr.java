package edu.gsu.nlp.processing;

import java.util.ArrayList;

public class WordStr {
	
	private String name;
	private int value=0;
	private ArrayList <WordPair> words=new ArrayList<WordPair>();
	
	public WordStr(){
	}
	
	public WordStr(String name, int value){
		this.name=name;
		this.value=value;
	}
	
	public String getName(){
		return this.name;
	}
	
	public void setName(String name){
		this.name=name;
	}
	
	public int getValue(){
		return this.value;
	}
	
	public void setValue(int value){
		this.value=value;
	}
	
	public ArrayList <WordPair> getChildren(){
		return this.words;
	}
	
	public void addChildren(WordPair w){
		words.add(w);
	}
}