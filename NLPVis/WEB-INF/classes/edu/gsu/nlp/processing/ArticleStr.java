package edu.gsu.nlp.processing;

import java.util.ArrayList;

public class ArticleStr{

	private String name;
	private int value=0;
	private ArrayList <ParagraphStr> children=new ArrayList <ParagraphStr>();

	public String getName(){
		return name;
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
	
	public ArrayList <ParagraphStr> getChildren(){
		return children;
	}
	
	public void addChildren(ParagraphStr p){
		children.add(p);
	}

}