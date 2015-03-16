package edu.gsu.nlp.processing;

import java.util.ArrayList;

public class ParagraphStr {

	private String id;
	private String name;
	private int value=0;
	private ArrayList <SentenceStr> children=new ArrayList <SentenceStr>();

	public ParagraphStr(){
	}
	
	public ParagraphStr(String id, String name, int value){
		this.id=id;
		this.name=name;
		this.value=value;
	}

	public String getId(){
		return this.id;
	}
	
	public void setId(String id){
		this.id=id;
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
	
	public ArrayList <SentenceStr> getChildren(){
		return this.children;
	}
	
	public void addChildren(SentenceStr s){
		children.add(s);
	}
}