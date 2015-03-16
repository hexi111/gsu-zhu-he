package edu.gsu.nlp.processing;

import java.util.Scanner;


public class WordFreq {

	private int seq;
	private String word;
	private char speech;
	private String speechName;
	private int freq;
	private String className;
	
	public WordFreq(String sentence){
		Scanner s=new Scanner(sentence);
		s.useDelimiter(",");
		seq=s.nextInt();
		word=s.next().replaceAll("[^a-zA-Z0-9\\s]","").trim();
		speech=s.next().trim().charAt(0);
		speechName=computeSpeechName(speech);
		try{
			freq=s.nextInt();
		}
		catch(Exception e){
			freq=-1;
		}
		className=computeClassName(freq);
		//if(word.equalsIgnoreCase("beauty")){
			//System.out.println("seq= "+seq+"word= "+word+"speech= "+speech+"speechName= "+speechName+"freq= "+freq);
		//}
	}
	
	public String computeClassName(int freq){
		String tmp;
		if(freq<=9999){
			tmp="freq1";
		}
		else if((freq>=10000)&&(freq<=99999)){
			tmp="freq2";
		}
		else if((freq>=100000)&&(freq<=999999)){
			tmp="freq3";
		}
		else if((freq>=1000000)&&(freq<=9999999)){
			tmp="freq4";
		}
		else if((freq>=10000000)&&(freq<=99999999)){
			tmp="freq5";
		}
		else{
			tmp="freq6";
		}
		return tmp;
	}
	// a c d e i j m n p r t u v x
	//VERB, NOUN, ADJ, ADV, IN, CC, EX, PRP, WP, WRB, UNKNOWN
	public String computeSpeechName(char speech){
		String tmp;
		switch(speech){			
			case 'c':	
				tmp="CC";
				break;
			case 'e':
				tmp="EX";
				break;
			case 'i':
				tmp="IN";
				break;
			case 'j':
				tmp="ADJ";
				break;
			case 'm':
				tmp="NOUN";
				break;
			case 'n':
				tmp="NOUN";
				break;
			case 'p':
				tmp="PRP";
				break;
			case 'r':
				tmp="ADV";
				break;
			case 't':
				tmp="IN";
				break;
			case 'v':
				tmp="VERB";
				break;
			case 'x':
			case 'u':
			case 'a':
			case 'd':			
			default:
				tmp="UNKNOWN";
		}	
		return tmp;
	}
	
	public String getClassName(){
		return className;
	}
	
	public void setClassName(String className){
		this.className=className;
	}
	
	public int getFreq(){
		return freq;
	}
	
	public void setFreq(int freq){
		this.freq=freq;
	}
	
	public String getSpeechName(){
		return speechName;
	}
	
	public void sestSpeechName(String speechName){
		this.speechName=speechName;
	}
	
	public char getSpeech(){
		return speech;
	}
	
	public void setSpeech(char speech){
		this.speech=speech;
	}
	
	public int getSeq(){
		return seq;
	}
	
	public void setSeq(int seq){
		this.seq=seq;
	}
	
	public String getWord(){
		return word;
	}
	
	public void setWord(String word){
		this.word=word;
	}
}