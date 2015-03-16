package edu.gsu.nlp.processing;

import java.util.List;
import java.util.ArrayList;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class WordList {
	
	private List <WordFreq> freqs=new ArrayList<WordFreq>();
	
	public WordList(String filename) throws IOException{
		
		BufferedReader is = new BufferedReader(new FileReader(filename));
		String str=is.readLine();
		while(str!=null){
			freqs.add(new WordFreq(str));
			str=is.readLine();
		}
		System.out.println("size= "+freqs.size());	
	}
	public String getClassName(String word, String speechName){
		for(WordFreq w:freqs){
			//if(w.getWord().equalsIgnoreCase("beauty")){
			//	System.out.println("speechName is "+w.getSpeechName()+"freq is "+w.getFreq());
			//}
			if(w.getWord().equalsIgnoreCase(word)&&(w.getSpeechName().equals(speechName))){
				return w.getClassName();
			}
		}
		return "freq6";
	}
}
