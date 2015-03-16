package edu.gsu.nlp.processing;

import java.util.ArrayList;

public class CorpusStr{

	private ArrayList <ArticleStr> children=new ArrayList <ArticleStr>();
	
	public CorpusStr(){
	}
		
	public ArrayList <ArticleStr> getChildren(){
		return this.children;
	}
	
	public void addChildren(ArticleStr p){
		children.add(p);
	}
}
