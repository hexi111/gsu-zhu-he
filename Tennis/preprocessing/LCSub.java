import java.io.FileReader;
import java.io.BufferedReader;

import java.io.FileWriter;
import java.io.BufferedWriter;

import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.Set;
import java.util.Iterator;
import java.util.Collections;

public class LCSub{
	
	private ArrayList <String> sentences = new ArrayList <String> ();
	private HashMap <String, Integer> patterns=new HashMap <String, Integer> ();
	
	public static void main(String [] args){
		LCSub lc=new LCSub();
		lc.findPatterns();
	}
	public void findPatterns(){
		
		//String result=computeLCSub("穆雷回球出浅，上前反拍抽压","相持中又是移动中正拍");
		//System.out.println("result="+result+" size="+result.length());
		
		try{
			/*
			String player1="穆雷";
			String player2="德约科维奇";
			String player3="小德";
			*/
			
			BufferedReader br=new BufferedReader(new FileReader("scores.txt"));
			
			String tmp="";
			while((tmp=br.readLine())!=null) {
				//tmp=tmp.replace(player1,"X");
				//tmp=tmp.replace(player2,"X");
				//tmp=tmp.replace(player3,"X");
				sentences.add(tmp);
			}
			int i,j;
			for(i=0;i<sentences.size();i++){
				for(j=(i+1);j<sentences.size();j++){
					//System.out.println("string1="+sentences.get(i));
					//System.out.println("string2="+sentences.get(j));					
					String result=computeLCSub(sentences.get(i),sentences.get(j));
					//System.out.println("result="+result);
					Integer count= patterns.get(result);
					if(count==null) {
						patterns.put(result,1);
					}
					else{
						patterns.put(result,new Integer(count.intValue()+1));
					}
				}
			}
			BufferedWriter bw=new BufferedWriter(new FileWriter("scores_out.txt"));
			Set < String > strs=patterns.keySet();
			Iterator <String> iter=strs.iterator();
			List < DataHolder> holders=new ArrayList <DataHolder> ();
			while(iter.hasNext()){
				String str=iter.next();
				DataHolder holder=new DataHolder();
				holder.setPattern(str);
				holder.setFrequency(patterns.get(str));
				//bw.write(str+" ");
				//bw.write(patterns.get(str));
				//System.out.println(str+" "+patterns.get(str));
				//bw.write(str+" "+patterns.get(str));
				//bw.newLine();
				holders.add(holder);
			}
			Collections.sort(holders);
			for(DataHolder x :holders){
				if(x.getPattern().length()>=4){
					bw.write(x.getPattern()+" "+x.getFrequency());
					bw.newLine();
				}
			}
			br.close();
			bw.close();
 		}
		catch(Exception e){
			e.printStackTrace();
		}
	}
	
	public String computeLCSub(String str1, String str2){
		int len1=str1.length();
		int len2=str2.length();
		int [] [] tables=new int [len1+1][len2+1];
		int i,j;
		int end=0;
		int maxLen=0;
		for(i=0;i<=len1;i++){
			tables[i][0]=0;
		}
		for(i=0;i<=len2;i++){
			tables[0][i]=0;
		}
		for(i=1;i<=len1;i++){
			for(j=1;j<=len2;j++){
				if(str1.charAt(i-1)==str2.charAt(j-1)){
					tables[i][j]=tables[i-1][j-1]+1;
					if(tables[i][j]>maxLen){
						maxLen=tables[i][j];
						end=i;
					}
				}
				else{
					tables[i][j]=0;
				}
			}
		}
		return str1.substring(end-maxLen,end);
	}

	private class DataHolder implements Comparable<DataHolder>{
	
	private String pattern;
	private int frequency;
	
	public String getPattern(){
		return pattern;
	}
	public void setPattern(String pattern){
		this.pattern=pattern;
	}
	public int getFrequency(){
		return frequency;
	}
	public void setFrequency(int frequency){
		this.frequency=frequency;
	}
	public int compareTo(DataHolder holder){
		
		//DataHolder holder=(DataHolder) o;
		if(this.frequency>holder.frequency) {
			return 1;
		}
		else if(this.frequency<holder.frequency) {
			return -1;
		}
		return 0;
	}
}
}