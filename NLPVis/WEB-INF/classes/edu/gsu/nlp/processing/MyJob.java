package edu.gsu.nlp.processing;

import java.util.List;
import edu.stanford.nlp.ling.HasWord;
import edu.stanford.nlp.trees.*;
import edu.stanford.nlp.parser.lexparser.LexicalizedParser;


public class MyJob implements Runnable {

	private int start;
	private int end;
	private List<String> sentences;
	private LexicalizedParser lp;
	private Tree [] trees;
	public MyJob(LexicalizedParser lp,List <String> sentences, int start, int end, Tree [] trees){
		this.start=start;
		this.end=end;
		this.sentences=sentences;
		this.lp=lp;
		this.trees=trees;
	}
	public void run(){
		int i;
		for(i=this.start;i<=this.end;i++){
			Tree parse = lp.parse(sentences.get(i));
			trees[i]=parse;
		}
	}
} 
