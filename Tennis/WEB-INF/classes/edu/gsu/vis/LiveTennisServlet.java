package edu.gsu.vis;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletContext;

import com.google.gson.Gson;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Iterator;
import java.util.Set;


public class LiveTennisServlet extends HttpServlet{
	ConcurrentHashMap<String, TennisMatch> TennisData;
	public void init() throws ServletException {
		ServletContext ctx = this.getServletContext();
		TennisData = (ConcurrentHashMap<String, TennisMatch>)ctx.getAttribute("TennisData");
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException{
		String name = request. getParameter("name");
		TennisMatch match = TennisData.get(name);
		Iterator <String> iter = TennisData.keySet().iterator();
		System.out.println("begin logging");
		while(iter.hasNext()){
			System.out.println(iter.next());
		}
		
		String json = new Gson().toJson(match);
		//System.out.println("json="+json);
		response.setContentType("text/json");  
		response.setCharacterEncoding("UTF-8"); 
		response.getWriter().write(json);
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException{
		doGet(request,response);
	}
}