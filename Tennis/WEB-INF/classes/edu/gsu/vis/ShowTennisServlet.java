package edu.gsu.vis;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class ShowTennisServlet extends HttpServlet{
	
	public void init() throws ServletException {
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException{
		String json = new Gson().toJson(parse());
		//System.out.println("json="+json);
		response.setContentType("text/json");  
		response.setCharacterEncoding("UTF-8"); 
		response.getWriter().write(json);
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException{
		doGet(request,response);
	}
	
	private TennisList parse(){
		TennisList data = new TennisList();
		TournamentList tmp = null;
		MatchList tmpMatch = null;
		Document doc = null;
		try {
			// need http protocol
			doc = Jsoup.connect("http://www.tennislive.net").get();
			Element match = doc.getElementById("match_list");
			Elements tables = match.getElementsByTag("table");
			Elements rows = tables.get(0).getElementsByTag("tr");
			for(int i = 0; i< rows.size(); i++){
				//System.out.println(row.attr("class"));		
				if(rows.get(i).attr("class").equals("header")){
					tmp = new TournamentList();
					tmp.name = rows.get(i).getElementsByTag("a").get(0).text();
					//System.out.println("name="+ tmp.name);
					data.addTournamentList(tmp);
				}
				else{
					tmpMatch = new MatchList();
					tmpMatch.name = rows.get(i).getElementsByTag("a").get(0).text();
					tmpMatch.host =Integer.valueOf(rows.get(i).getElementsByTag("td").get(2).text());
					i++;
					tmpMatch.name += " VS ";
					tmpMatch.name += rows.get(i).getElementsByTag("a").get(0).text();
					tmpMatch.guest =Integer.valueOf(rows.get(i).getElementsByTag("td").get(2).text());
					tmp.addMatchList(tmpMatch);
					//System.out.println("name=" + tmpMatch.name + "host=" + tmpMatch.host + "guest=" + tmpMatch.guest);		
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return data;
	}
	
	private class TennisList {
    	List <TournamentList> lists = new ArrayList<TournamentList>();
    	public List <TournamentList> getTournamentLists(){
    		return lists;
    	}
    	public void addTournamentList(TournamentList l){
    		this.lists.add(l);
    	}
    }

    private class TournamentList {
		String name;
		List <MatchList> lists = new ArrayList<MatchList>();
		public List <MatchList> getMatchLists(){
			return lists;
		}
		public void addMatchList(MatchList l){
			this.lists.add(l);
		}
	}
	    
    private class MatchList {
    	String name;
    	int host;
    	int guest;
    }
    
}