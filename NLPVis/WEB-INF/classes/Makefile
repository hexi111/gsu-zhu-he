compile:
	#javac -classpath stanford-parser.jar edu/gsu/nlp/*.java
	#javac -classpath /Library/tomcat/lib/servlet-api.jar:../lib/gson-2.2.4.jar:../lib/stanford-parser.jar edu/gsu/nlp/*.java edu/gsu/nlp/processing/*.java
	javac -classpath /Library/tomcat/lib/servlet-api.jar:../lib/gson-2.2.4.jar:../lib/stanford-parser.jar:../lib/commons-fileupload-1.3.1.jar:../lib/commons-io-2.4.jar edu/gsu/nlp/processing/*.java
run:
	#java -mx1600m -classpath stanford-parser.jar:stanford-parser-3.3.0-models.jar:. edu.gsu.nlp.SentenceAnalysis edu/stanford/nlp/models/lexparser/englishPCFG.ser.gz sample.txt 