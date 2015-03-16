package edu.gsu.nlp.processing;

import edu.stanford.nlp.trees.Tree;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 *
 * @author Ying Zhu
 */
public class ParsedSentence {
    // A ParsedSentence is a collection of ParsedWord(s).

    private static int MIN_NUM_STRESSED_WORDS = 4;
    private ArrayList<ParsedWord> words;
    //private Tree parseTreeRoot = null;
    private boolean selected;
    private boolean isNewLine = false;
    private String originalSentence = null;
    private int sentenceLength = 0;
	private String treePresentation;
    //*************************************
    // Constructors
    public ParsedSentence(Tree parseTree, String originalSentence,
            boolean isNewLine) {
        words = new ArrayList<ParsedWord>();
        //this.parseTreeRoot = parseTree;
        Tree parseTreeRoot=parseTree;
        this.originalSentence = originalSentence;
        this.isNewLine = isNewLine;

        if (parseTreeRoot != null) {
            
            this.treePresentation=printTree(parseTree);
            // Find the root node for the sentences separated by ; or :
            ArrayList<ArrayList<Tree>> sentences = divideSentences(parseTreeRoot);

            // For each sentence separated by ; or :, retrieve each word,
            // record its POS tag, and identify topic string and stressed words.
            Iterator<ArrayList<Tree>> itr = sentences.iterator();
            while (itr.hasNext()) {
                ArrayList<Tree> sentence = itr.next();
                // Here we identify a topic string for each sentence.
                // However, one may choose to identify the topic string only
                // for the first sentence.
                addWords(sentence,parseTreeRoot);
            }
        } else {
            // Can we delete this? 
            //if it's a newline
            words.add(new ParsedWord(originalSentence,
                    "UNKNOWN", false, false));
        }

        Iterator itr = words.iterator();
        while (itr.hasNext()) {
            ParsedWord word = (ParsedWord) itr.next();
            if (word.isRealWord()) {
                sentenceLength++;
            }
        }
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
		System.out.println("Tree: "+temp.toString());
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

    public ParsedSentence(ArrayList<ParsedWord> words) {
        this.words = words;
    }

    //*************************************
    // Public methods
    public ArrayList<ParsedWord> getWords() {
        return words;
    }

    public boolean isSelected() {
        return selected;
    }

    public void setSelected(boolean selected) {
        this.selected = selected;
    }

    private String getTopicString() {
        String topicString = "";
        Iterator<ParsedWord> itrWord = words.iterator();
        while (itrWord.hasNext()) {
            ParsedWord aWord = itrWord.next();
            if (aWord.isTopic()) {
                topicString += aWord + " ";
            }
        }

        return topicString;
    }

    private String getStressedWords() {
        String stressedWords = "";
        Iterator<ParsedWord> itrWord = words.iterator();
        while (itrWord.hasNext()) {
            ParsedWord aWord = itrWord.next();
            if (aWord.isStressed()) {
                stressedWords += aWord + " ";
            }
        }

        return stressedWords;
    }

    public boolean isIsNewLine() {
        return isNewLine;
    }

    public void setIsNewLine(boolean isNewLine) {
        this.isNewLine = isNewLine;
    }

    //****************************************
    // Private methods
    private ArrayList<ArrayList<Tree>> divideSentences(Tree root) {
        if (root == null) {
            return null;
        }

        List<Tree> nodes = root.preOrderNodeList();

        if (nodes == null) {
            return null;
        }

        ArrayList<ArrayList<Tree>> sentences = new ArrayList<ArrayList<Tree>>();
        ArrayList<Tree> currentSentence = new ArrayList<Tree>();
        sentences.add(currentSentence);

        Iterator<Tree> itr = nodes.iterator();
        while (itr.hasNext()) {
            Tree node = itr.next();
            currentSentence.add(node);
            if (node.isLeaf() && isCommaOrSemicolon(node)) {
                currentSentence = new ArrayList<Tree>();
                sentences.add(currentSentence);
            }
        }

        return sentences;
    }

    private boolean isCommaOrSemicolon(Tree node) {
        if (node == null) {
            return false;
        }

        String label = node.label().value();
        if ((label.compareToIgnoreCase(";") == 0)
                || (label.compareToIgnoreCase(":") == 0)) {
            return true;
        } else {
            return false;
        }
    }

    // Further divide the parsed sentence into words.
    // Each word and its POS is stored in a ParsedWord.
    // To-do:
    // The topic string contains all the words before the first
    // major verb phrase.
    // To-do:
    // - What if there is no major verb phrase? Mark the first verb phrase as
    //   the major verb phrase. If no verb phrase is found, do not mark topic
    //   string.
    // - SNLP cannot handle quoted sentences well.
    // - SNLP cannot handle parentheses (including citations) well.
    // The stressed words are the last few words before a period (.),
    // a semi-colon (;), and an exclamation mark (!).
    // (What about the question mark?)
    // (How to handle too few stressed words?)
    // Rules:
    // - Starting with the last phrasal node, check the number of leaf siblings
    //   between it and the end of the sentence.
    //   If it's less than 5, then find
    //   the previous phrasal node. Continue until 1. there are 5 or more
    //   words; 2. The major verb phrase is reached.
    //   Save the current node (in the 2nd case, including the major verb phrase)
    //   as the first stressed phrasal node.
    // Alternative rules:
    // - The first Noun Phrase after the last Verb Phrase.
    // - If there is no Noun Phrase after the last Verb Phrase, then
    //   mark the last verb phrase as stressed.
    // - If the distance between the last verb and the end of the sentence is
    //   too short (less than 3 words), then mark the last verb phrase as
    //   stressed.
    // - If the distance between the last verb and the end of the sentence is
    //   too long (more than 6 words), then only highlight the last four words.
    // to-do: needs a better algorithm to identify topic string 
    // and stressed words. 
    private void addWords(ArrayList<Tree> sentence,Tree parseTreeRoot) {
        if ((parseTreeRoot == null) || (sentence == null)
                || (sentence.isEmpty())) {
            // to-do: print out a warning message.
            return;
        }

        // Find the major VP

        Tree firstNode = sentence.get(0);
        // If there is no sibling, siblings() will return null.
        List<Tree> siblings = firstNode.siblings(parseTreeRoot);

        if (siblings == null) {
            siblings = new ArrayList<Tree>();
        }

        siblings.add(0, firstNode);

        // Can't use siblings.toArray() to cast Object to Tree. 
        // So we have to do the conversion ourselves.
        Tree[] nodes = new Tree[siblings.size()];
        for (int i = 0; i < nodes.length; i++) {
            nodes[i] = siblings.get(i);
        }

        // We have to use an array instead of an ArrayList because
        // Tree.preOrderNodeList() returns an array, and we need to use it
        // to call this method recursively.
        Tree majorVP = findMajorVP(nodes);

        // Contingency plan: if we can't find the major VP through normal
        // method, then the first VP or the first verb is the major VP.
        if (majorVP == null) {
            majorVP = findFirstVP(sentence);
            // If we still cannot find the major VP, then the first verb is the
            // the major VP.
            if (majorVP == null) {
                majorVP = findFirstVerb(sentence);
                // If we still cannot find the major VP, then give up.
                if (majorVP == null) {
                    System.out.println("Can't find the major verb phrase.");
                }
            }
        }

        // Find the first stressed node
        Tree firstStressedNode = null;
        for (int i = sentence.size() - 1; i >= 0; i--) {
            Tree node = sentence.get(i);

            if ((node == majorVP)
                    || ((node.isPhrasal())
                    && (getNumberOfLeafNodes(sentence, i)
                    >= MIN_NUM_STRESSED_WORDS))
                    || (i == 0)) {
                firstStressedNode = node;
                break;
            }
        }

        if (firstStressedNode == null) {
            System.out.println("Can't find the first stressed node.");
        }

        // Classify and add words into the word list.
        boolean isTopicString = (majorVP != null) ? true : false;
        boolean isStressedWord = false;

        Iterator<Tree> itr = sentence.iterator();
        while (itr.hasNext()) {
            Tree node = itr.next();

            if (node == majorVP) {
                isTopicString = false;
            }

            if (node.isLeaf()) {
                String word = node.value();
                String label = node.parent(parseTreeRoot).label().value();

                words.add(new ParsedWord(word, label,
                        isTopicString, isStressedWord));
            }

            if (node == firstStressedNode) {
                isStressedWord = true;
            }
        }
    }

    private Tree findMajorVP(Tree[] nodes) {

        // There are two loops.
        // First loop: find the first VP node. If found, return as the majorVP.
        // Second loop: if majorVP not found, then go through all the S siblings,
        // get its children, and recursively call this method.
        // If a major VP is found, then
        // return it. Otherwise if, after going through all the
        // node, the major VP is still not found, return null.
        for (int i = 0; i < nodes.length; i++) {
            if (nodes[i].isPhrasal() && (isVerbPhrase(nodes[i]))) {
                return nodes[i];
            }
        }

        for (int i = 0; i < nodes.length; i++) {
            if (isSentence(nodes[i])) {
                Tree majorVP = findMajorVP(nodes[i].children());
                if (majorVP != null) {
                    return majorVP;
                }
            }
        }

        return null;
    }

    private Tree findFirstVP(ArrayList<Tree> sentence) {
        if (sentence == null) {
            return null;
        }

        Iterator<Tree> itr = sentence.iterator();
        while (itr.hasNext()) {
            Tree node = itr.next();
            if (node.isPhrasal() && isVerbPhrase(node)) {
                return node;
            }
        }

        return null;
    }

    private Tree findFirstVerb(ArrayList<Tree> sentence) {
        if (sentence == null) {
            return null;
        }

        Iterator<Tree> itr = sentence.iterator();
        while (itr.hasNext()) {
            Tree node = itr.next();
            if (node.isPreTerminal() && isVerb(node)) {
                return node;
            }
        }

        return null;
    }

    private boolean isVerbPhrase(Tree node) {
        return (node.label().value().compareToIgnoreCase("VP") == 0) ? true : false;
    }

    private boolean isVerb(Tree node) {
        if (node == null) {
            return false;
        }

        String label = node.value();

        if (label.compareToIgnoreCase("VB") == 0
                || label.compareToIgnoreCase("VBD") == 0
                || label.compareToIgnoreCase("VBG") == 0
                || label.compareToIgnoreCase("VBN") == 0
                || label.compareToIgnoreCase("VBP") == 0
                || label.compareToIgnoreCase("VBZ") == 0) {
            return true;
        } else {
            return false;
        }
    }

    private int getNumberOfLeafNodes(ArrayList<Tree> nodeList, int index) {
        if (nodeList == null) {
            return 0;
        }

        int numOfWords = 0;
        for (int i = index; i < nodeList.size(); i++) {
            Tree node = nodeList.get(i);

            if (node.isLeaf() && !isPunctuationMark(node)) {
                numOfWords++;
            }
        }

        // to-do: exclude punctuation marks.
        return numOfWords;
    }

    private boolean isSentence(Tree node) {
        String label = node.label().value();
        if ((label.compareToIgnoreCase("S") == 0)
                || (label.compareToIgnoreCase("SINV") == 0)
                || (label.compareToIgnoreCase("ROOT") == 0)) {
            return true;
        } else {
            return false;
        }
    }

    public int getSentenceLength() {
        return sentenceLength;
    }
    
    private boolean isPunctuationMark(Tree node) {
        if (!node.isLeaf()) {
            return false;
        }

        String value = node.value();

        // to-do: Use regular expression. The list of punctuation marks is 
        // incomplete. 
        if (value.compareToIgnoreCase(";") == 0
                || value.compareToIgnoreCase(".") == 0
                || value.compareToIgnoreCase(":") == 0
                || value.compareToIgnoreCase(",") == 0
                || value.compareToIgnoreCase("``") == 0
                || value.compareToIgnoreCase("\"") == 0
                || value.compareToIgnoreCase("-LRB-") == 0
                || value.compareToIgnoreCase("-RRB-") == 0
                || value.compareToIgnoreCase("'") == 0
                || value.compareToIgnoreCase("!") == 0
                || value.compareToIgnoreCase("?") == 0
                || value.compareToIgnoreCase("''") == 0
                || value.compareToIgnoreCase("-") == 0) {
            return true;
        } else {
            return false;
        }
    }
}
