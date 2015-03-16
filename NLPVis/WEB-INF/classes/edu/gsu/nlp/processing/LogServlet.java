package edu.gsu.nlp.processing;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.Collections;
import java.util.Iterator;

import java.util.Date;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class LogServlet extends HttpServlet{

	private List <String> originalList;
	private List <String> modifiedList;
	
	public void init() throws ServletException {
		originalList=new ArrayList<String>();
		modifiedList=Collections.synchronizedList(originalList);
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException{
		
		String opCode=request.getParameter("code");
		DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		Date date = new Date();
		synchronized (modifiedList) {
      		modifiedList.add(opCode+","+dateFormat.format(date));
  		}
  		response.setContentType("text/html");  
		response.setCharacterEncoding("UTF-8"); 
		response.getWriter().write("OK");
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException{
		doGet(request,response);
	}
	
	public void destroy(){
		
		try{
			DateFormat dateFormat = new SimpleDateFormat("yyyy_MM_dd_HH_mm_ss");
			Date date = new Date();
			String path = getServletContext().getRealPath("/WEB-INF/log/"+dateFormat.format(date).trim()+".log");
			BufferedWriter fp = new BufferedWriter(new FileWriter(path));
			synchronized (modifiedList) {
				Iterator <String> iter = modifiedList.iterator(); // Must be in synchronized block
				while (iter.hasNext()){
					fp.write(iter.next());
					fp.newLine();
				}
			}
			fp.close();
		}catch(Exception e){
		}
	}
}
