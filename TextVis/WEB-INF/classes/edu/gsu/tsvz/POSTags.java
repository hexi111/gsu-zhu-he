package edu.gsu.tsvz;


/**
 *
 * @author Ying Zhu
 */

// based on http://bioie.ldc.upenn.edu/wiki/index.php/POS_tags
/*
 * AFX: Affix (non-, anti-, pro-)
 * CC:  Coordinating conjunction (and, but, nor, or, etc.)
 * CD: Cardinal number
 * DT: Determiner (a, an, every, no, the)
 * EX: Existential there (there was ...)
 * FW: Foreign word (e.g. Latin words)
 * HYPH: Hyphen
 * IN: Proposition or subordinating conjunction (though, although, due to)
 * JJ: Adjective
 * JJR: Adjective, comparative (greater, higher)
 * JJS: Adjective, superlative (-est, best, worst, most, least)
 * LS: List item (1., 2., (a), (b) )
 * MD: Modal verb (can, could, may, ...)
 * NN: Noun, singlular common
 * NNP: Noun, singular proper (individual name, places, organization, etc.)
 * NNPS: Noun, plural proper
 * NNS: Noun, plural common
 * PDT: Predeterminer (all, both, quite, half, rather, etc.)
 * POS: Possessive ('s, ')
 * PRP: Personal pronoun (I, me, you, he, mine, yours, hers))
 * PRP$: Personal pronoun, possessive (my, your, his, her, its)
 * RB: Adverb (-ly, quite, too, very)
 * RBR: Adverb, comparative (more, less)
 * RBS: Adverb, superlative (most)
 * RP: Particle (?)
 * SYM: Symbol (Greek letters)
 * TO: to
 * UH: Interjection (exclamations)
 * VB: verb, base form (do)
 * VBD: Verb, past tense
 * VBG: Verb, present participle (-ing)
 * VBN: Verb, past participle (-ed)
 * VBP: Verb, present tense, not 3rd person singular (?)
 * VBZ: Verb, present tense, 3rd person singular
 * WDT: Wh-determiner (which, that)
 * WP: Wh-pronoun (what, who, and whom)
 * WP$: Wh-pronoun, possessive (whose)
 * WRB: Wh-adverb (how, where, why)
 * LRB: Left round braces
 * RRB: Right round braces
 * PUNC: Punctuation marks
 */
public enum POSTags { AFX, CC, CD, DT, DOLLAR, EX, FW, HYPH, IN, JJ, JJR, JJS,
LS, MD, NN, NNP, NNPS, NNS, PDT, POS, PRP, PRP$, RB, RBR, RBS, RP, SYM,
TO, UH, VB, VBD, VBG, VBN, VBP, VBZ, WDT, WP, WP$, WRB, LRB, RRB, PUNC, 
UNKNOWN};
