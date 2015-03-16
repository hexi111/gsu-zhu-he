package edu.gsu.nlp.processing;

import java.util.ArrayList;

public class Matching {

	private ArrayList<MatchingEntry> children=new ArrayList<MatchingEntry>();
	
	public ArrayList<MatchingEntry> getChildren(){
		return children;
	}
	
	public void addChildren(MatchingEntry m){
		children.add(m);
	}
}