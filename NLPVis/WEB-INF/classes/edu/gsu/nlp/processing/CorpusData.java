package edu.gsu.nlp.processing;


public class CorpusData{

	private ArticlesStatistics articlesStatistics;
	private CorpusStatistics corpusStatistics;
	private CorpusStr corpusStr;
	private CorpusTxt corpusTxt;
	private Matching matching;
	private Colors colors;
	private CorpusNameSet corpusNameSet;
	
	public CorpusNameSet getCorpusNameSet(){
		return corpusNameSet;
	}
	
	public void setCorpusNameSet(CorpusNameSet nameSet){
		this.corpusNameSet=nameSet;
	}
	
	public ArticlesStatistics getArticlesStatistics(){
		return articlesStatistics;
	}
	
	public void setArticlesStatistics(ArticlesStatistics articlesStatistics){
		this.articlesStatistics=articlesStatistics;
	}
	
	public CorpusStatistics getCorpusStatistics(){
		return corpusStatistics;
	}
	
	public void setCorpusStatistics(CorpusStatistics corpusStatistics){
		this.corpusStatistics=corpusStatistics;
	}
	
	public CorpusStr getCorpusStr(){
		return corpusStr;
	}
	
	public void setCorpusStr(CorpusStr corpusStr){
		this.corpusStr=corpusStr;
	}
	
	public CorpusTxt getCorpusTxt(){
		return corpusTxt;
	}
	
	public void setCorpusTxt(CorpusTxt corpusTxt){
		this.corpusTxt=corpusTxt;
	}
	
	public Matching getMatching(){
		return this.matching;
	}
	
	public void setMatching(Matching matching){
		this.matching=matching;
	}
	
	public Colors getColors(){
		return this.colors;
	}
	
	public void setColors(Colors colors){
		this.colors=colors;
	}
}