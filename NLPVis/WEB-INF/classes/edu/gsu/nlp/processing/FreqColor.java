package edu.gsu.nlp.processing;

public class FreqColor {
	
	private String name;
	private String color;
	
	public FreqColor(String name, String color){
		setName(name);
		setColor(color);
	}
	
	public String getName(){
		return name;
	}	
	
	public void setName(String name){
		this.name=name;
	}
	
	public String getColor(){
		return color;
	}
	
	public void setColor(String color){
		this.color=color;
	}
}