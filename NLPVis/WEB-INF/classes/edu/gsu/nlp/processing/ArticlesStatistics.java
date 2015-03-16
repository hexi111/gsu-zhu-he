package edu.gsu.nlp.processing;

import java.util.ArrayList;

public class ArticlesStatistics{

	private ArrayList <ArticleStaEntry> children=new ArrayList<ArticleStaEntry>();
	
	public ArrayList <ArticleStaEntry> getChildren(){
		return children;
	}
	
	public void addChildren(ArticleStaEntry s){
		children.add(s);
	}
}