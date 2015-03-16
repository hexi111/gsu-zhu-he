package edu.gsu.nlp.processing;

public class CorpusStatistics{
	
	private String corpus;
	private int articles;
	private int sentences;
	private int words;
	private int totalPages;
	
	public CorpusStatistics(){
	}
	
	public CorpusStatistics(String corpus,int articles,int sentences,int words,int totalPages){
		this.corpus=corpus;
		this.articles=articles;
		this.sentences=sentences;
		this.words=words;
		this.totalPages=totalPages;
	}
	
	public String getCorpus(){
		return this.corpus;
	}
	
	public void setCorpus(String corpus){
		this.corpus=corpus;
	}
	
	public int getArticles(){
		return this.articles;
	}
	
	public void setArticles(int articles){
		this.articles=articles;
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

	public int getTotalPages(){
		return this.totalPages;
	}
	
	public void setTotalPages(int totalPages){
		this.totalPages=totalPages;
	}
}