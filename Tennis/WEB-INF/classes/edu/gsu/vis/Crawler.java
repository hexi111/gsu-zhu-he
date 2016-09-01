package edu.gsu.vis;

import java.util.concurrent.ConcurrentHashMap;
import java.io.IOException;
import java.util.Iterator;

import com.google.gson.Gson;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class Crawler implements Runnable{
	
	private ConcurrentHashMap<String, TennisMatch> TennisData;
	
	public Crawler(ConcurrentHashMap<String, TennisMatch> TennisData){
		this.TennisData = TennisData;
	}
	
	public void run() {
		Document doc = null;
		try {
			// need http protocol
			//System.out.println("Here");
			doc = Jsoup.connect("http://www.tennislive.net").get();
			//System.out.println("***************************");
			Element elem_match = doc.getElementById("match_list");
			Elements tables = elem_match.getElementsByTag("table");
			Elements rows = tables.get(0).getElementsByTag("tr");
			String name = null;
			for(int i = 0; i< 3; i++){
				if(rows.get(i).attr("class").equals("header")){
				}
				else{
					int [][] tmp = new int [7][2];
					name = rows.get(i).getElementsByTag("a").get(0).text();
					for(int j=0;j<7;j++){
						String str = rows.get(i).getElementsByTag("td").get(j+2).text();
						if(str.trim().length() == 0){
							tmp[j][0] = 0;
						}
						else if(str.trim().equalsIgnoreCase("A")){
							tmp[j][0] = 50;
						}
						else{
							tmp[j][0] =Integer.valueOf(str);
						}
					}
					i++;
					name += " VS ";
					name += rows.get(i).getElementsByTag("a").get(0).text();
					//System.out.println("name="+name);
					//System.out.println("i="+i);					
					for(int j=0;j<7;j++){
						String str = rows.get(i).getElementsByTag("td").get(j+1).text();
						//System.out.println("str="+str);
						if(str.trim().length() == 0){
							tmp[j][1] = 0;
						}
						else if(str.trim().equalsIgnoreCase("A")){
							tmp[j][1] = 50;
						}
						else{
							tmp[j][1] =Integer.valueOf(str);
						}
					}
					for(int k = 0; k < 7; k++){
						//System.out.println(tmp[k][0]+","+tmp[k][1]);
					}
					
					if(TennisData.containsKey(name)){
						TennisData.get(name).update(tmp);
					}
					else{
						TennisMatch match = new TennisMatch();
						match.create(tmp);
						TennisData.put(name,match);
					}
				}
			}
			print(TennisData,name);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public void print(ConcurrentHashMap<String, TennisMatch> TennisData, String name){
		/*
		Iterator<String> iter = TennisData.keySet().iterator();
		while(iter.hasNext()){
			String json = new Gson().toJson(TennisData.get(iter.next()));
			System.out.println(json);
		}
		*/
		String json = new Gson().toJson(TennisData.get(name));
		//System.out.println(json);
	}
}