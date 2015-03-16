package edu.gsu.nlp.processing;

public class WordPair {

	private String id;
	private String word;
	private String kind;
	private String freq;
	
	public WordPair(){
	}
	
	public WordPair(String id, String kind,String freq){
		this.id=id;
		this.kind=kind;
		this.freq=freq;
	}
	
	public String getWord(){
		return this.word;
	}
	
	public void setWord(String word){
		this.word=word;
	}
	
	public String getId(){
		return this.id;
	}
	
	public void setId(String id){
		this.id=id;
	}
	
	public String getKind(){
		return this.kind;
	}
	
	public void setKind(String kind){
		this.kind=kind;
	}
	
	public String getFreq(){
		return freq;
	}
	
	public void setFreq(String freq){
		this.freq=freq;
	}
	
}