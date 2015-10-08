package edu.gsu.vis;

import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;

public class ParseQueryServlet extends HttpServlet{
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		String queryString=request.getParameter("queryString");
		int numOfSets=new Integer(request.getParameter("numOfSets"));
		String name1=request.getParameter("name1");
		String name2=request.getParameter("name2");
		QueryResult result = new QueryResult(numOfSets);
		result.parse(queryString,name1,name2,numOfSets);
		String json = new Gson().toJson(result);
		//System.out.println("json="+json);
		response.setContentType("text/json");  
		response.setCharacterEncoding("UTF-8"); 
		response.getWriter().write(json);
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException{
		doGet(request,response);
	}
	
	private class QueryResult{
		
		private int [] status; // 0: invisible; 1: visible
		private int [] people; // two players; 
		private int character; // technical terms;
		
		public QueryResult(int numOfSets){
			status=new int [numOfSets];
			people=new int [2];
		}
		public void parse(String queryString, String name1, String name2,int numOfSets) {
			int i;
			for(i=0;i<numOfSets;i++){
				status[i]=0;
			}
			status[0]=1;
			status[1]=1;
			people[0]=1;
			people[1]=1;
			character=0;
		}
	}
}