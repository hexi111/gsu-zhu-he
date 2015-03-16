package edu.gsu.nlp.processing;

import java.io.IOException;
import java.io.StringReader;
import java.io.File;
import java.io.FileReader;
import java.io.BufferedReader;
import java.io.FileWriter;
import java.io.BufferedWriter;

import java.util.ArrayList;
import java.util.List;
import java.util.Iterator;
import java.util.concurrent.Executors;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.HashMap;
import java.util.Set;
import java.util.HashSet;

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
	private HashMap<String, CorpusData> corpusSet=new HashMap<String, CorpusData>();
	private WordList WL;
	private CorpusNameSet nameSet;
	
	public void init() throws ServletException {
		String grammar= "edu/stanford/nlp/models/lexparser/englishPCFG.ser.gz";
    	String[] options = { "-maxLength", "80", "-retainTmpSubcategories" };
    	lp = LexicalizedParser.loadModel(grammar, options);
    	threadPool=Executors.newFixedThreadPool(nThreads);
    	try{
	    	nameSet=new CorpusNameSet(getServletContext().getRealPath("/WEB-INF/repository/corpusName.txt"));
		}
		catch(IOException e){
			throw new ServletException();
		}
		//System.out.println("Testing2");
	}

	// The main functionality of this servlet is to parse a set of articles and return a complex objects that contain 
	// information about the parsed sentences in the articles set.
	// The request object may contain the following parameters:
	// corpusName: the name of corpus to be processed.
	// title: the name of the to-be-appended article.
	// content: the content of the to-be-appended article.
	// type: the type of the request 1: query 2. append 3. import
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException{
			 				
		String title=request.getParameter("title");
		String content=request.getParameter("content");
		String type=request.getParameter("type");
		String corpusName=request.getParameter("corpusName");
		
		if(WL==null){
			WL=new WordList(getServletContext().getRealPath("/WEB-INF/repository/word_frequency_list.csv"));
		}
		// if we have parsed the given corpus, and cached the generated object
		// then we just need to return the cached object.
		if(corpusSet.containsKey(corpusName)) {
			CorpusData CD=corpusSet.get(corpusName);
			if(type.equals("2")){
				BufferedWriter bw=new BufferedWriter(new FileWriter(getServletContext().getRealPath("/WEB-INF/repository/"+corpusName+"/"+title+".txt")));
				bw.write(content);
				bw.close();
				processOneArticle(CD, content, title, CD.getCorpusStatistics().getArticles()+1);
				CD.getCorpusStatistics().setTotalPages((CD.getCorpusStatistics().getArticles()-1)/NLPConstants.ARTICLES_PER_PAGE+1);
				corpusSet.put(corpusName,CD);
			}
			String json = new Gson().toJson(CD);
			//System.out.println("json="+json);
			response.setContentType("text/json");  
			response.setCharacterEncoding("UTF-8"); 
			response.getWriter().write(json);  
		}
		else{
			//System.out.println("Testing1");
			CorpusData CD=new CorpusData();
			CorpusStatistics CS=new CorpusStatistics();
			ArticlesStatistics AS=new ArticlesStatistics();
			Matching MM=new Matching();
			CorpusTxt CT=new CorpusTxt();
			CorpusStr CStr=new CorpusStr();
	
			CD.setCorpusStatistics(CS);
			CD.setArticlesStatistics(AS);
			CD.setMatching(MM);
			CD.setCorpusTxt(CT);
			CD.setCorpusStr(CStr);
			CD.setCorpusNameSet(nameSet);
			//System.out.println("corpusName="+corpusName);
			//System.out.println("type="+type);
			if(type.equals("3")){
				nameSet.getNameSet().add(corpusName);
			}
			String path = getServletContext().getRealPath("/WEB-INF/repository/"+corpusName);
			File[] files = new File(path).listFiles();		
			CS.setArticles(0);
			CS.setSentences(0);
			CS.setWords(0);
			if(files!=null){
				int aid=0;
				for(File file:files){
					if(file.isDirectory()){
						continue;
					}
					if(!file.getName().substring(file.getName().lastIndexOf(".")+1).equals("txt")){
						continue;
					}
					aid++;
					BufferedReader is = new BufferedReader(new FileReader(file));
					//Read the entire text from the file.
					StringBuilder builder=new StringBuilder();
					String str=is.readLine();
					while(str!=null){
						builder.append(str);
						builder.append("\n");
						str=is.readLine();
					}
					String text=builder.toString();
					String name=file.getName().substring(0,file.getName().lastIndexOf("."));
					processOneArticle(CD, text,name,aid);
				}
				//CorpusStatistics
				CS.setCorpus(corpusName);
				CS.setTotalPages((CS.getArticles()-1)/NLPConstants.ARTICLES_PER_PAGE+1);
				corpusSet.put(corpusName,CD);
				
				//Speech and freq colors
				//VERB, NOUN, ADJ, ADV, IN, CC, EX, PRP, WP, WRB, UNKNOWN
				//rgb(255,0,0);rgb(0,255,0);rgb(0,0,255); rgb(255,255,0);rgb(0,255,255);
				//rgb(255,0,255);rgb(192,192,192);rgb(255,255,255);rgb(192,0,192);rgb(192,192,0);rgb(0,0,0);
				
				Colors CL=new Colors();
				CL.addSpeech(new SpeechColor("VERB","#c4bd97"));
				CL.addSpeech(new SpeechColor("NOUN","#95b3d7"));
				CL.addSpeech(new SpeechColor("ADJ","#d8d8d8"));
				CL.addSpeech(new SpeechColor("ADV","#c0504d"));
				CL.addSpeech(new SpeechColor("IN","#e5e0ec"));
				CL.addSpeech(new SpeechColor("CC","#7f7f7f"));
				CL.addSpeech(new SpeechColor("EX","#dbeef3"));
				CL.addSpeech(new SpeechColor("PRP","#fbd5b5"));
				CL.addSpeech(new SpeechColor("WP","#e36c09"));
				CL.addSpeech(new SpeechColor("WRB","#31859b"));
				CL.addSpeech(new SpeechColor("UNKNOWN","#366092"));
				
				CL.addFreqs(new FreqColor("freq1","#c4bd97"));
				CL.addFreqs(new FreqColor("freq2","#95b3d7"));
				CL.addFreqs(new FreqColor("freq3","#d8d8d8"));
				CL.addFreqs(new FreqColor("freq4","#c0504d"));
				CL.addFreqs(new FreqColor("freq5","#e5e0ec"));
				CL.addFreqs(new FreqColor("freq6","#7f7f7f"));
		
				CD.setColors(CL);
				
				String json = new Gson().toJson(CD);
				//System.out.println("json="+json);
				response.setContentType("text/json");  
				response.setCharacterEncoding("UTF-8"); 
				response.getWriter().write(json); 
			}	
		}		    	
	}
	
	// Process one article
	public void processOneArticle(CorpusData CD, String text, String name,int aid) throws ServletException{
		
		//System.out.println("Testing2");
		/* Define some variables for corpus statistics */
		int articlesTotal=CD.getCorpusStatistics().getArticles();
		int sentencesTotal=CD.getCorpusStatistics().getSentences();
		int wordsTotal=CD.getCorpusStatistics().getWords();
					
		// Prepare for the CorpusStr object.
		ArticleStr AStr=new ArticleStr();
		ArrayList <String> allSentences=new ArrayList<String>();
		int sentencesArticles=0;
		int wordsArticles=0;
		ArrayList<String> paragraphs = getParagraphs(text);
		int [] beginIdx=new int[paragraphs.size()];
		int [] endIdx=new int[paragraphs.size()];
		int counter=-1;
		int pid=0;
		StringBuffer content=new StringBuffer();
		content.append("<span id=\"article\">");
		for(int i=0;i<paragraphs.size();i++){		
			pid++;
			ParagraphStr PStr=new ParagraphStr();
			PStr.setId("p"+pid);
			PStr.setName("p"+pid);
			String aParagraph = paragraphs.get(i);
			content.append("<span id=\""+PStr.getId()+"\">");
			ArrayList<String> sentences = getSentences(aParagraph,PStr,content);
			content.append("</span><br/><br/>");
			beginIdx[i]=counter+1;
			counter+=sentences.size();
			endIdx[i]=counter;
			allSentences.addAll(sentences);	
			wordsTotal+=PStr.getValue();
			wordsArticles+=	PStr.getValue();
			sentencesTotal+=sentences.size();
			sentencesArticles+=sentences.size();
			AStr.addChildren(PStr);
			AStr.setValue(AStr.getValue()+PStr.getValue());
		}
		content.append("</span>");
		AStr.setName(name);
		CD.getCorpusStr().addChildren(AStr);
	
		//prepare for the ArticleStatistics objects
		ArticleStaEntry AE=new ArticleStaEntry();
		AE.setName(name);
		AE.setWords(wordsArticles);
		AE.setSentences(sentencesArticles);
		Fathom.Stats stats = Fathom.analyze(text);
		float fleschKincaidIndex = Readability.calcKincaid(stats);
		float fleschIndex = Readability.calcFlesch(stats);
		float fogIndex = Readability.calcFog(stats);
		AE.setFleschKincaidIndex(fleschKincaidIndex);
		AE.setFleschIndex(fleschIndex);
		AE.setFogIndex(fogIndex);
		CD.getArticlesStatistics().addChildren(AE);
	
		// Prepare for CorpusTxt object
		ArticleTxt AT=new ArticleTxt();
		AT.setName(name);
		AT.setContent(content.toString());
		CD.getCorpusTxt().addChildren(AT);
	
		// Prepare Matching
		MatchingEntry ME=new MatchingEntry();
		ME.setId(aid);
		ME.setName(name);
		ME.setLoc(aid);
		CD.getMatching().addChildren(ME);		
	
		counter++;
		articlesTotal++;
		CD.getCorpusStatistics().setArticles(articlesTotal);
		CD.getCorpusStatistics().setSentences(sentencesTotal);
		CD.getCorpusStatistics().setWords(wordsTotal);

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
		
		int numLexicalWords=0;
		int maxSentenceLength=0;
		int minSentenceLength=10000;
		int numNoun=0;
		int numAdj=0;
		int numAdv=0;
		int numVerb=0;
		Set<String> uniqueWords=new HashSet<String>();
		
		//prepare for the ArticleStatistics objects
		for(int i=0;i<paragraphs.size();i++){
			for(int j=beginIdx[i];j<=endIdx[i];j++){
				//System.out.println("paragraph "+i+";sentence "+(j-beginIdx[i])+"is "+allSentences.get(j));
				AStr.getChildren().get(i).getChildren().get(j-beginIdx[i]).setStructure(printTree(trees[j]));
				List<Tree> parsedWords=trees[j].getLeaves();
				int sentenceLength=parsedWords.size();
				for(int k=0;k<sentenceLength;k++){
					String superTag= getSuperTag(parsedWords.get(k),trees[j]);
					//AStr.getChildren().get(i).getChildren().get(j-beginIdx[i]).getChildren().get(k/NLPConstants.WORD_PER_ROW).getChildren().get(k%NLPConstants.WORD_PER_ROW).setKind(getSuperTag(parsedWords.get(k),trees[j]));							
					AStr.getChildren().get(i).getChildren().get(j-beginIdx[i]).getTypes().get(k).setKind(superTag);							
					AStr.getChildren().get(i).getChildren().get(j-beginIdx[i]).getTypes().get(k).setFreq(WL.getClassName(parsedWords.get(k).value(),superTag));							
					AStr.getChildren().get(i).getChildren().get(j-beginIdx[i]).getTypes().get(k).setWord(parsedWords.get(k).value());
					//System.out.println(getSuperTag(parsedWords.get(k),trees[j]));
					if(superTag.equals("NOUN")||superTag.equals("VERB")||superTag.equals("ADJ")||superTag.equals("ADV")){
						numLexicalWords++;	
					}
					if(superTag.equals("NOUN")){
						numNoun++;
					}			
					else if(superTag.equals("VERB")){
						numVerb++;
					}	
					else if(superTag.equals("ADJ")){
						numAdj++;
					}	
					else if(superTag.equals("ADV")){
						numAdv++;
					}	
					uniqueWords.add(parsedWords.get(k).value().trim());
				}
				
				if(maxSentenceLength<sentenceLength){
					maxSentenceLength=sentenceLength;
				}
				if(minSentenceLength>sentenceLength){
					minSentenceLength=sentenceLength;
				}
			}
		}
		AE.setLexicalDensity(numLexicalWords*100.00/AE.getWords());
		AE.setMinSentenceLength(minSentenceLength);
		AE.setMaxSentenceLength(maxSentenceLength);
		AE.setAverageSentenceLength(AE.getWords()*1.00/AE.getSentences());
		AE.setPerceNoun(numNoun*1.00/AE.getWords());
		AE.setPerceVerb(numVerb*1.00/AE.getWords());
		AE.setPerceAdj(numAdj*1.00/AE.getWords());
		AE.setPerceAdv(numAdv*1.00/AE.getWords());
		AE.setUniqueWords(uniqueWords.size());
	
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException{
		doGet(request,response);
	}
	
	public void destroy(){
		threadPool.shutdown();
		try{
			nameSet.cleanup(getServletContext().getRealPath("/WEB-INF/repository/corpusName.txt"));
		}
		catch(IOException e){
		}
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
    public ArrayList<String> getSentences(String aParagraph,ParagraphStr PStr,StringBuffer content) {

        String pid=PStr.getId();
        if (aParagraph == null) {
            return null;
        }

        ArrayList<String> sentences = new ArrayList<String>();

        DocumentPreprocessor dp = new DocumentPreprocessor(new StringReader(aParagraph));       
        int sid=0;
        for (List<HasWord> wordList : dp) {
            if (wordList != null) {
            	SentenceStr SStr=new SentenceStr();
            	sid++;
            	SStr.setId(pid+"s"+sid);
            	SStr.setName("s"+sid);
            	content.append("<span id=\""+SStr.getId()+"\">");
            	int wid=0;
                String aSentence = "";
                Iterator<HasWord> itr2 = wordList.iterator();
                //ArrayList <WordPair> WPS=new ArrayList<WordPair>();
                while (itr2.hasNext()) {
                    HasWord aWord = itr2.next();
                    aSentence += aWord.word() + " ";
                	wid++;
                	WordPair WP=new WordPair();
                	//FreqPair FP=new FreqPair();
                    WP.setId(SStr.getId()+"w"+wid);
                    content.append("<span id=\""+WP.getId()+"\">");
                    content.append(aWord.word());
                    content.append("</span> ");
                    //WPS.add(WP);
                    SStr.addTypes(WP);
                    //SStr.addFreqs(FP);
                }
                content.append("</span> ");
                SStr.setValue(SStr.getTypes().size());

                /*
                SStr.setValue(WPS.size());
                for(int i=0;i<WPS.size();i=i+NLPConstants.WORD_PER_ROW){
                	WordStr WS=new WordStr();
                	WS.setName(i/NLPConstants.WORD_PER_ROW+"");
                	if((i+NLPConstants.WORD_PER_ROW)>=WPS.size()){
                		WS.setValue(WPS.size()-i);
                	}
                	else{
                		WS.setValue(NLPConstants.WORD_PER_ROW);
                	}
                	for(int j=0;j<WS.getValue();j++){
                		WS.addChildren(WPS.get(i+j));
                	}
                	SStr.addChildren(WS);
                }
                */

                sentences.add(aSentence);
                PStr.addChildren(SStr);
          		PStr.setValue(PStr.getValue()+SStr.getValue());
            }
        }
        return sentences;
    }

	public String printTree(Tree root){
		
		StringBuffer temp=new StringBuffer();
		temp.append("{\"name\": \"\",\"children\":[");
		Tree [] trees=root.children();
		temp.append(printNode(trees[0]));
		for(int i=1;i<trees.length;i++){
			temp.append(",");
			temp.append(printNode(trees[i]));
		}
		temp.append("]}");
		//System.out.println("Tree: "+temp.toString());
		return temp.toString();
	}
	public String printNode(Tree node){
		
		StringBuffer temp=new StringBuffer();
		temp.append("{\"name\":");
		temp.append("\"");
		temp.append(node.value());
		temp.append("\"");
		Tree [] children=node.children();
		if(children.length!=0){
			temp.append(",\"children\":[");
			temp.append(printNode(node.getChild(0)));
			for(int i=1;i<children.length;i++){
				temp.append(",");
				temp.append(printNode(node.getChild(i)));
			}
			temp.append("]");			
		}
		temp.append("}");	
		return temp.toString();
	}

	public String getSuperTag(Tree node,Tree root){
		
		String word = node.value();
        String posTagStr = node.parent(root).label().value(); 
	 	
	 	POSTags posTag = POSTags.UNKNOWN;
	 	// Still need to expand this list
        if (word.matches("[.,?!:;\"'\u201D\u201C\u2014’]+")) {
            posTag = POSTags.PUNC;
        } else if (word.compareTo("$") == 0) {
            posTag = POSTags.DOLLAR;
        } else if (word.compareTo("-LRB-") == 0) {
            word = "(";
            posTag = POSTags.PUNC; // or LRB
        } else if (word.compareTo("-RRB-") == 0) {
            word = ")";
            posTag = POSTags.PUNC;  // OR RRB
        } else {
            try {
                posTag = POSTags.valueOf(posTagStr);
            } catch (IllegalArgumentException e) {
                if (posTagStr.equalsIgnoreCase("``") || 
                        posTagStr.equalsIgnoreCase(":")) {
                    posTag = POSTags.PUNC;
                } else {
                    System.out.println("Can't parse " + posTagStr);
                }
            }
        }
        
        POSSuperTags superTag = getPOSSuperTag(posTag); 
        return superTag.toString();
	}
	
	public POSSuperTags getPOSSuperTag(POSTags posTag) {

        POSSuperTags superTag = POSSuperTags.UNKNOWN;

        switch (posTag) {
            case VB:
            case VBD:
            case VBG:
            case VBN:
            case VBP:
            case VBZ:
            // case MD: // don't include auxiliary verbs (can, will) for now
                superTag = POSSuperTags.VERB;
                break;

            case NN:
            case NNP:
            case NNPS:
            case NNS:
                superTag = POSSuperTags.NOUN;
                break;

            case JJ:
            case JJR:
            case JJS:
                superTag = POSSuperTags.ADJ;
                break;

            case RB:
            case RBR:
            case RBS:
                superTag = POSSuperTags.ADV;
                break;

            case IN:
                superTag = POSSuperTags.IN;
                break;

            case CC:
                superTag = POSSuperTags.CC;
                break;

            case EX:
                superTag = POSSuperTags.EX;
                break;
            case PRP:
            case PRP$:
                superTag = POSSuperTags.PRP;
                break;

            case WP:
            case WP$:
                superTag = POSSuperTags.WP;
                break;

            default:
                superTag = POSSuperTags.UNKNOWN;
                break;
        }

        return superTag;
    }

}
