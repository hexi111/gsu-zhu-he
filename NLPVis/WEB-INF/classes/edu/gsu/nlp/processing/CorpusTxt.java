package edu.gsu.nlp.processing;

import java.util.ArrayList;

public class CorpusTxt {

	private ArrayList <ArticleTxt> children=new ArrayList <ArticleTxt>();
	
	public ArrayList <ArticleTxt> getChildren(){
		return children;
	}
	
	public void addChildren(ArticleTxt a){
		children.add(a);
	}

}