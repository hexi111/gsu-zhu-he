package edu.gsu.nlp.processing;

public class MatchingEntry {

	private int id;
	private String name;
	private int loc;
	
	
	public MatchingEntry(){
	
	}
	
	public MatchingEntry(int id, String name, int loc){
		this.id=id;
		this.name=name;
		this.loc=loc;
	}
	
	public int getId(){
		return this.id;
	}
	
	public void setId(int id){
		this.id=id;
	}

	public String getName(){
		return this.name;
	}
	
	public void setName(String name){
		this.name=name;
	}
	
	public int getLoc(){
		return this.loc;
	}
	
	public void setLoc(int loc){
		this.loc=loc;
	}

}