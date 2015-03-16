package edu.gsu.nlp.processing;

import java.util.List;
import java.util.ArrayList;

public class Colors {
	private List <SpeechColor> speeches=new ArrayList <SpeechColor>();
	private List <FreqColor> freqs=new ArrayList <FreqColor>();
	
	public List <SpeechColor> getSpeeches(){
		return speeches;
	}
	
	public List <FreqColor> getFreqs(){
		return freqs;
	}
	
	public void addSpeech(SpeechColor speech){
		speeches.add(speech);
	}
	
	public void addFreqs(FreqColor freq){
		freqs.add(freq);
	}
}
	