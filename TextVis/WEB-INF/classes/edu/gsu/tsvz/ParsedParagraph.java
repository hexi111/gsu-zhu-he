package edu.gsu.tsvz;


import java.util.ArrayList;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author Ying Zhu
 */
public class ParsedParagraph {

    private ArrayList<ParsedSentence> parsedSentences; 
    
    public ParsedParagraph() {
        parsedSentences = new ArrayList<ParsedSentence>();
    }

    public void addParsedSentence(ParsedSentence aParsedSentence) {
        parsedSentences.add(aParsedSentence);
    }

    public ArrayList<ParsedSentence> getParsedSentences() {
        return parsedSentences;
    }
}
