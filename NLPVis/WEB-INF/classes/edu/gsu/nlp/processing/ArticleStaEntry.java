package edu.gsu.nlp.processing;

public class ArticleStaEntry{

	private String name;
	private int sentences;
	private int words;
	private float fleschKincaidIndex;
	private float fleschIndex;
	private float fogIndex;
	private double lexicalDensity;
	private int maxSentenceLength=0;
	private int minSentenceLength=0;
	private double averageSentenceLength=0.0;
	private double perceNoun=0.0;
	private double perceVerb=0.0;
	private double perceAdj=0.0;
	private double perceAdv=0.0;
	private int uniqueWords=0;
				
	public ArticleStaEntry(){
	}
	
	public ArticleStaEntry(String name, int sentences, int words){
		this.name=name;
		this.sentences=sentences;
		this.words=words;
	}
	
	public int getUniqueWords(){
		return uniqueWords;
	}
	
	public void setUniqueWords(int uniqueWords){
		this.uniqueWords=uniqueWords;
	}
	
	
	public double getPerceNoun(){
		return perceNoun;
	}
	
	public void setPerceNoun(double perceNoun){
		this.perceNoun=perceNoun;
	}

	public double getPerceVerb(){
		return perceVerb;
	}
	
	public void setPerceVerb(double perceVerb){
		this.perceVerb=perceVerb;
	}	

	public double getPerceAdv(){
		return perceAdv;
	}
	
	public void setPerceAdv(double perceAdv){
		this.perceAdv=perceAdv;
	}	
	
	public double getPerceAdj(){
		return perceAdj;
	}
	
	public void setPerceAdj(double perceAdj){
		this.perceAdj=perceAdj;
	}	
	
	public double getAverageSentenceLength(){
		return averageSentenceLength;
	}
	
	public void setAverageSentenceLength(double averageSentenceLength){
		this.averageSentenceLength=averageSentenceLength;
	}
	
	public int getMaxSentenceLength(){
		return this.maxSentenceLength;
	}
	
	public void setMaxSentenceLength(int maxSentenceLength){
		this.maxSentenceLength=maxSentenceLength;
	}
	
	public int getMinSentenceLength(){
		return this.minSentenceLength;
	}
	
	public void setMinSentenceLength(int minSentenceLength){
		this.minSentenceLength=minSentenceLength;
	}
	
	public double getLexicalDensity(){
		return this.lexicalDensity;
	}
	
	public void setLexicalDensity(double lexicalDensity){
		this.lexicalDensity=lexicalDensity;
	}
	
	public float getFleschKincaidIndex(){
		return this.fleschKincaidIndex;
	}
	
	public void setFleschKincaidIndex(float fleschKincaidIndex){
		this.fleschKincaidIndex=fleschKincaidIndex;
	}
	
	public float getFleschIndex(){
		return this.fleschIndex;
	}
	
	public void setFleschIndex(float fleschIndex){
		this.fleschIndex=fleschIndex;
	}
	
	public float getFogIndex(){
		return this.fogIndex;
	}
	
	public void setFogIndex(float fogIndex){
		this.fogIndex=fogIndex;
	}
	
	public String getName(){
		return this.name;
	}
	
	public void setName(String name){
		this.name=name;
	}
	
	public int getSentences(){
		return this.sentences;
	}
	
	public void setSentences(int sentences){
		this.sentences=sentences;
	}
	
	public int getWords(){
		return this.words;
	}
	
	public void setWords(int words){
		this.words=words;
	}
		
}