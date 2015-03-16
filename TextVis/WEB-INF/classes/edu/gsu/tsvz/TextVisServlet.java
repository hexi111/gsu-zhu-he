package edu.gsu.tsvz;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Iterator;
import java.util.concurrent.Executors;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;


import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import edu.stanford.nlp.ling.CoreLabel;
import edu.stanford.nlp.ling.HasWord;
import edu.stanford.nlp.ling.Label;
import edu.stanford.nlp.ling.Word;
import edu.stanford.nlp.process.DocumentPreprocessor;
import edu.stanford.nlp.process.Tokenizer;
import edu.stanford.nlp.trees.*;
import edu.stanford.nlp.parser.lexparser.LexicalizedParser;


/*
	Some of the codes are borrowed from TextAnalyzer.java written by Dr. Zhu.
*/
public class TextVisServlet extends HttpServlet{

	private LexicalizedParser lp;
	private ExecutorService threadPool;
	public final int nThreads=20;
	public final int nThreadsPerRequest=2;

	
	public void init() throws ServletException {
		String grammar= "edu/stanford/nlp/models/lexparser/englishPCFG.ser.gz";
    	String[] options = { "-maxLength", "80", "-retainTmpSubcategories" };
    	lp = LexicalizedParser.loadModel(grammar, options);
    	threadPool=Executors.newFixedThreadPool(nThreads);
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException{
			 
		String text=request.getParameter("input");
		
		int counter=-1;
		System.out.println("text="+text);
		text=text.replaceAll("([a-zA-Z])(\\.)([a-zA-Z])","$1$2 $3");
		System.out.println("text="+text);
		ArrayList<String> paragraphs = getParagraphs(text);
		ArrayList <String> allSentences=new ArrayList<String>();
		int [] beginIdx=new int[paragraphs.size()];
		int [] endIdx=new int[paragraphs.size()];

		for(int i=0;i<paragraphs.size();i++){
			
            String aParagraph = paragraphs.get(i);
            // Divide the aSentence into sentences
            ArrayList<String> sentences = getSentences(aParagraph);
			beginIdx[i]=counter+1;
			counter+=sentences.size();
			endIdx[i]=counter;
			allSentences.addAll(sentences);			
        }
        counter++;
        
        //Parsing in parallel
        Tree [] trees=new Tree [counter];
		List<Callable<Object>> todo = new ArrayList<Callable<Object>>(nThreadsPerRequest);
		
		for(int i=0;i<nThreadsPerRequest;i++){
			int start=i*counter/nThreadsPerRequest;
			int end=(i+1)*counter/nThreadsPerRequest-1;
			todo.add(Executors.callable(new MyJob(lp,allSentences,start,end,trees)));
		}
		try{
			threadPool.invokeAll(todo);
		}catch(InterruptedException e){
			throw new ServletException(e);
		}
        
        //Construct the output objects 
	    ArrayList<ParsedParagraph> parsedText = new ArrayList<ParsedParagraph>();		
        for(int i=0;i<paragraphs.size();i++){
			ParsedParagraph aParsedParagraph = new ParsedParagraph();
			for(int j=beginIdx[i];j<=endIdx[i];j++){
				aParsedParagraph.addParsedSentence(
						new ParsedSentence(trees[j], allSentences.get(j), false));
			}
			parsedText.add(aParsedParagraph);
		}

        String json = new Gson().toJson(parsedText);
					
		response.setContentType("text/json");  // Set content type of the response so that jQuery knows what it can expect.
		response.setCharacterEncoding("UTF-8"); // You want world domination, huh?
		response.getWriter().write(json);       // Write response body.
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException{
		doGet(request,response);
	}
	
	public void destroy(){
		threadPool.shutdown();
	}
		
	/**
     * Divide the text into paragraphs
     *
     * @return a list of paragraphs
     */
    public ArrayList<String> getParagraphs(String text) {
        
        if (text == null) {
            return null;
        }
		String[] paragraphs1 = text.split("\n\n+");
		ArrayList<String> paragraphs = new ArrayList<String>();
		for (int i = 0; i < paragraphs1.length; i++) {
			String aParagraph = paragraphs1[i].trim();
			if (!aParagraph.isEmpty()) {
				paragraphs.add(aParagraph);
			}
		}
		return paragraphs;
    }

    /**
     * Split a paragraph into sentences
     *
     * @param aParagraph
     * @return a list of sentences
     */
    public ArrayList<String> getSentences(String aParagraph) {

        if (aParagraph == null) {
            return null;
        }

        ArrayList<String> sentences = new ArrayList<String>();

        DocumentPreprocessor dp = new DocumentPreprocessor(new StringReader(aParagraph));       
        for (List<HasWord> wordList : dp) {
            if (wordList != null) {
                String aSentence = "";
                Iterator<HasWord> itr2 = wordList.iterator();
                while (itr2.hasNext()) {
                    HasWord aWord = itr2.next();
                    aSentence += aWord.word() + " ";
                }
                sentences.add(aSentence);
            }
        }
        return sentences;
    }


}
