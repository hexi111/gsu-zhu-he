package edu.gsu.nlp.processing;


public class ArticleTxt {

	private String name;
	private String content;
	
	public ArticleTxt(){
	}
	
	public ArticleTxt(String name, String content){
		this.name=name;
		this.content=content;
	}
	
	public String getName(){
		return this.name;
	}
	
	public void setName(String name){
		this.name=name;
	}
	
	public String getContent(){
		return this.content;
	}
	
	public void setContent(String content){
		this.content=content;
	}

}
