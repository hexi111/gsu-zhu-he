package edu.gsu.nlp.processing;

// import com.representqueens.lingua.en.Syllable;

/**
 *
 * @author Ying Zhu
 */
public class ParsedWord {

    private String word;
    private POSTags posTag = POSTags.UNKNOWN;
    private boolean periodOrSemiColonOrColon = false;
    private boolean isTopic = false;
    private boolean isStressed = false;
    private boolean isSelected = false;
    private int offset = 0;
    private int numSyllable = 0;
    private boolean isComplexWord = false;
    private boolean isLexicalWord = false; 
    //private Object complexWordHighlighter = null;
    //private Object longSentenceHighlighter = null;
    //private Object customizedWordListHighlighter = null;
    private boolean isRealWord = false; 
    private boolean isPartOfLongSentence = false;

    public ParsedWord(String word, String posTagStr,
            boolean isTopic, boolean isStressed) {
        this.word = word;

        this.isTopic = isTopic;
        this.isStressed = isStressed;

        if (word.matches("[.;:!?]")) {
            periodOrSemiColonOrColon = true;
        }

        if (word.compareTo("''") == 0) {
            this.word = "\u201D";
        } else if (word.compareTo("``") == 0) {
            this.word = "\u201C";
        } else if (word.compareTo("--") == 0) {
            this.word = "\u2014";
        }

        // Still need to expand this list
        if (word.matches("[.,?!:;\"'\u201D\u201C\u2014’]+")) {
            posTag = POSTags.PUNC;
        } else if (word.compareTo("$") == 0) {
            posTag = POSTags.DOLLAR;
        } else if (word.compareTo("-LRB-") == 0) {
            this.word = "(";
            posTag = POSTags.PUNC; // or LRB
        } else if (word.compareTo("-RRB-") == 0) {
            this.word = ")";
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
        
        POSSuperTags superTag = getPOSSuperTag();
        
        switch (superTag) {
            case NOUN:
            case VERB:
            case ADJ:
            case ADV:
                isLexicalWord = true;
                break;
            default: 
                isLexicalWord = false;
                break;
        }
        
        setIsRealWord();
        
    }

    public int getOffset() {
        return offset;
    }

    public void setOffset(int offset) {
        this.offset = offset;
    }

    public int getWordLength() {
        if (word == null) {
            return 0;
        }

        return word.length();
    }

    public boolean isTopic() {
        return isTopic;
    }

    public void setTopic(boolean isTopic) {
        this.isTopic = isTopic;
    }

    public boolean isStressed() {
        return isStressed;
    }

    public void setStressed(boolean stressed) {
        this.isStressed = stressed;
    }

    public boolean isSelected() {
        return isSelected;
    }

    public void setSelected(boolean isSelected) {
        this.isSelected = isSelected;
    }

    public boolean isPunctuationMark() {
        return (posTag == POSTags.PUNC);
    }

    public boolean isPeriodOrSemiColonOrColon() {
        return periodOrSemiColonOrColon;
    }

    public POSTags getPOSTag() {
        return posTag;
    }

    public POSSuperTags getPOSSuperTag() {

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

    public boolean isIsLexicalWord() {
        return isLexicalWord;
    }
    
    public String getWord() {
        return word;
    }

    public int getNumSyllable() {
        return numSyllable;
    }

    public boolean isComplexWord() {
        return isComplexWord;
    }

    public void setIsComplexWord(boolean isComplexWord) {
        this.isComplexWord = isComplexWord;
    }
    
    /*
    public Object getComplexWordHighlighter() {
        return complexWordHighlighter;
    }

    public void setComplexWordHighlighter(Object highlighter) {
        this.complexWordHighlighter = highlighter;
    }

    public Object getLongSentenceHighlighter() {
        return longSentenceHighlighter;
    }

    public void setLongSentenceHighlighter(Object longSentenceHighlighter) {
        this.longSentenceHighlighter = longSentenceHighlighter;
    }

    public Object getCustomizedWordListHighlighter() {
        return customizedWordListHighlighter;
    }

    public void setCustomizedWordListHighlighter(
            Object customizedWordListHighlighter) {
        this.customizedWordListHighlighter = customizedWordListHighlighter;
    }
        
    */
    
    private void setIsRealWord() {
        switch(posTag) {
            case CC: 
            case CD:
            case DT:
            case EX:
            case FW:
            case IN: 
            case JJ: 
            case JJR:
            case JJS:
            case MD: 
            case NN:
            case NNP:
            case NNPS:
            case NNS:
            case PDT:
            case PRP:
            case PRP$:
            case RB: 
            case RBR:
            case RBS:
            case RP:
            case SYM:
            case TO:
            case UH:
            case VB:
            case VBD:
            case VBG:
            case VBN:
            case VBP:
            case VBZ:
            case WDT:
            case WP:
            case WP$:
            case WRB: 
                isRealWord = true;
                break;
            default: 
                isRealWord = false;
                break;
        }
    }

    public boolean isPartOfLongSentence() {
        return isPartOfLongSentence;
    }

    public void setIsPartOfLongSentence(boolean isPartOfLongSentence) {
        this.isPartOfLongSentence = isPartOfLongSentence;
    }

    public boolean isRealWord() {
        return isRealWord;
    }
    
    @Override
    public String toString() {
        return word;
    }
}
