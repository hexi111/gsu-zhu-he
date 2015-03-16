package edu.gsu.storygraph;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletContext;

import com.google.gdata.client.spreadsheet.SpreadsheetService;
import com.google.gdata.client.spreadsheet.FeedURLFactory;
import com.google.gdata.data.spreadsheet.WorksheetFeed;
import com.google.gdata.data.spreadsheet.ListFeed;
import com.google.gdata.data.spreadsheet.WorksheetEntry;
import com.google.gdata.data.spreadsheet.ListEntry;
import com.google.gdata.util.ServiceException;

import java.io.IOException;
import java.net.URL;
import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;
import java.util.regex.Matcher;
import java.util.Set;
import java.util.Iterator;
import java.util.HashMap;

public class DataProviderServlet extends HttpServlet{

	private SpreadsheetService service;
	private ConcurrentHashMap<String, AllRecords> workSheets;
	public void init() throws ServletException {
		service=new SpreadsheetService("storygraph");
		workSheets=new ConcurrentHashMap<String, AllRecords>();
	}
	
	protected String formatDate(String theDate){
		//System.out.println("date="+theDate);
		int loc=theDate.indexOf("/");
		int loc1=theDate.indexOf("/",(loc+1));
		//System.out.println("loc="+loc);
		//System.out.println("loc1="+loc1);
		String month=theDate.substring(0,loc);
		if(month.length()==1){
			month="0"+month;
		}
		String day=theDate.substring((loc+1),loc1);
		if(day.length()==1){
			day="0"+day;
		}
		String year=theDate.substring(loc1+1,loc1+5);
		int loc2=theDate.indexOf(":");
		String hours=theDate.substring(loc1+6,(loc2));
		if(hours.length()==1){
			hours="0"+hours;
		}
		int loc3=theDate.indexOf(":",(loc2+1));
		String mins="";
		if(loc3>loc2){
			mins=theDate.substring((loc2+1),loc3);
		}
		else{
			mins=theDate.substring(loc2+1);
		}
		//System.out.println("hours="+hours);
		String formattedDate=month+"/"+day+"/"+year+" "+hours+":"+mins;
		//System.out.println("formattedDate="+formattedDate);
		return formattedDate;
	}
	
	protected String getKey(String address){
		//System.out.println("address="+address);
		String REGEX ="/spreadsheets/d/.*/edit";
		int start=0;
		int end=0;
		Pattern p = Pattern.compile(REGEX);
		Matcher m = p.matcher(address);
		if(m.find()){
			start=m.start();
			end=m.end();
			//System.out.println("extraced key="+address.substring((start+16),(end-5)));
		}
		else {
			REGEX="key=.*";
			//System.out.println(address);
			p = Pattern.compile(REGEX);
			m = p.matcher(address);
			if(m.find()){
				start=m.start();
				end=m.end();
				//System.out.println("extraced key="+address.substring((start+4),(end)));
				return address.substring((start+4),(end));
			}
			return "";
		}
		return address.substring((start+16),(end-5));
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException{
				
		try{
			String key;
			if(request.getParameter("key")!=null){
				key=request.getParameter("key");
			}
			else{
				key=getKey(request.getParameter("address"));
			}
			AllRecords ARS=null;
			String output="";
			if(key.equals("")){
				throw new ServiceException("1");
			}
			if(workSheets.containsKey(key)){
				ARS=workSheets.get(key);
				double lat1=0.0;
				double lat2=0.0;
				double lon1=0.0;
				double lon2=0.0;
				if(request.getParameter("lat1")!=null){
					lat1=new Double(request.getParameter("lat1")).doubleValue();
					lat2=new Double(request.getParameter("lat2")).doubleValue();
					lon1=new Double(request.getParameter("lon1")).doubleValue();
					lon2=new Double(request.getParameter("lon2")).doubleValue();					
					ARS=ARS.getSubset(lat1,lat2,lon1,lon2);
				}
			}
			else{	
				URL url = FeedURLFactory.getDefault().getWorksheetFeedUrl(key, "public", "values");
				WorksheetFeed worksheetFeed = service.getFeed(url, WorksheetFeed.class);
				List<WorksheetEntry> worksheets = worksheetFeed.getEntries();
				WorksheetEntry worksheet = worksheets.get(0);

				// Fetch the list feed of the worksheet.
				URL listFeedUrl = worksheet.getListFeedUrl();
				ListFeed listFeed = service.getFeed(listFeedUrl, ListFeed.class);
			
				int latPos=-1;
				int lonPos=-1;
				int datPos=-1;
			
				ARS=new AllRecords();
				StringBuilder builder=new StringBuilder();
				// Iterate through each row, printing its cell values.
				List <ListEntry> rows = listFeed.getEntries();
				HashMap<OneRecord, OneRecord> detector=new HashMap<OneRecord, OneRecord>();
				int sum=0;
				//System.out.println("rowsize="+rows.size());
				for(int index=0;index<rows.size();index++){
					Set<String> tags=rows.get(index).getCustomElements().getTags();
					if(index==0){
						Iterator<String> iter=tags.iterator();
						int pos=-1;
						String tag;
						while(iter.hasNext()){
							pos++;
							tag=iter.next();
							// Make sure column name "latitude", "longitude" and "date" are there
							if(tag.equals("latitude")){
								latPos=pos;
							}
							else if(tag.equals("longitude")){
								lonPos=pos;
							}
							else if(tag.equals("date")){
								datPos=pos;
							}
							builder.append(tag.replace("|"," ")+"|");
						}
						if((latPos==-1)||(lonPos==-1)||(datPos==-1)){
							throw new ServiceException("2");	
						}
						//ARS.setTitles(builder.substring(0,builder.length()-1)+System.getProperty("line.separator"));
						//ARS.setTitles(builder.toString()+System.getProperty("line.separator"));
						builder.append("secretcolumn|");
						ARS.setTitles(builder.toString()+"|");
					}
					//else
						{
						try{
							OneRecord OR=new OneRecord();
							StringBuilder content=new StringBuilder();
							OR.setLatitude(new Double(rows.get(index).getCustomElements().getValue("latitude")).doubleValue());
							OR.setLongitude(new Double(rows.get(index).getCustomElements().getValue("longitude")).doubleValue());
							for (String tag : tags) {
								if(tag.equals("date")){
									content.append(formatDate(rows.get(index).getCustomElements().getValue(tag)).replace("|"," ") + "|");
								}
								else{
									content.append(rows.get(index).getCustomElements().getValue(tag).replace("|"," ") + "|");
								}
							}	
							if(detector.containsKey(OR)){
								detector.get(OR).add();
								//System.out.println("repeat!");
							}
							else{
								//System.out.println("not repeat!");
								detector.put(OR,OR);
								OR.add();
							}
							//OR.setContent(content.substring(0,content.length()-1));
							OR.setContent(content.toString());
							ARS.addRecord(OR);
							//sum++;
							//System.out.println("sum+ "+sum);
						}
						catch(NullPointerException e){
							continue;
						}
					}
				}
				workSheets.put(key,ARS);
			}
			if(ARS.size()==0){
				throw new ServiceException("3");
			}
			String tmp=ARS.toString();
			String tmp2="";
			ARS.calulateCenter();
			double centerLat=ARS.getCenterLat();
			double centerLon=ARS.getCenterLon();
			tmp2="{\"key\":\""+key+"\",\"size\":"+new Integer(ARS.size()).toString()+",\"returncode\":0,\"centerLat\":"+new Double(centerLat).toString()+",\"centerLon\":"+new Double(centerLon).toString();
			tmp2=tmp2+",\"content\":\""+tmp+"\"}";
			//System.out.println("tmps="+tmp2);
			response.setContentType("text/json");  
			response.setCharacterEncoding("UTF-8"); 
			response.getWriter().write(tmp2);
		}
		catch(ServiceException e){
			e.printStackTrace();
			String tmp2="";
			int errorCode=-1;
			if(e.getMessage().equals("1")){
				errorCode=1;
			}
			else if(e.getMessage().equals("2")){
				errorCode=2;
			}
			else if(e.getMessage().equals("3")){
				errorCode=3;
			}
			else{
				errorCode=4;	
			}
			tmp2="{\"key\":\"\",\"size\":0,\"returncode\":"+errorCode+",\"centerLat\":0.0,\"centerLon\":0.0,\"content\":\" \"}";
			//System.out.println("tmp2="+tmp2);
			response.setContentType("text/json");  
			response.setCharacterEncoding("UTF-8"); 
			response.getWriter().write(tmp2);
		}		
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException{
		doGet(request,response);
	}	
	
	private class OneRecord{
		
		private double latitude;
		private double longitude;
		private String content;
		private int counter=0;
		
		public void add(){
			counter++;
		}
		@Override 
		public boolean equals(Object obj){
			OneRecord OR=(OneRecord)(obj);
			//System.out.println("latitude= "+OR.getLatitude()+","+latitude);
			//System.out.println("longitude= "+OR.getLongitude()+","+longitude);
			return ((Math.abs(OR.getLatitude()-latitude)<0.0000001)&&(Math.abs(OR.getLongitude()-longitude)<0.0000001));
		}
		@Override 
		public int hashCode(){
			return (int)(latitude)+(int)(longitude);
		}
		
		public double getLatitude(){
			return this.latitude;
		}
		public void setLatitude(double latitude){
			this.latitude=latitude;
		}
		public double getLongitude(){
			return this.longitude;
		}
		public void setLongitude(double longitude){
			this.longitude=longitude;
		}
		public String getContent(){
			return this.content;
		}
		public void setContent(String content){
			this.content=content;
		}
		public String toString(){
			//return this.content+System.getProperty("line.separator");
			return this.content+counter+"|"+"|";
		}
	}
	
	private class AllRecords{
		
		private ArrayList <OneRecord> records=new ArrayList<OneRecord>();
		private String titles;
		
		
		public AllRecords getSubset(double lat1, double lat2, double lon1, double lon2){
			AllRecords AR=new AllRecords();
			AR.setTitles(this.getTitles());
			for(OneRecord record:records){
				if((record.getLatitude()>=lat1)&&(record.getLatitude()<=lat2)&&(record.getLongitude()>=lon1)&&(record.getLongitude()<=lon2)){
					AR.addRecord(record);
				}
			}
			return AR;
		}
		
		public ArrayList <OneRecord> getRecords(){
			return records;
		}
		public void addRecord(OneRecord record){
			records.add(record);
		}
		public String getTitles(){
			return this.titles;
		}
		public void setTitles(String titles){
			this.titles=titles;
		}
		public String toString(){
			StringBuilder builder=new StringBuilder();
			builder.append(titles);
			for(OneRecord OR: records){
				builder.append(OR.toString());
			}
			return builder.toString();
		}
		
		public int size(){
			return records.size();
		}
		public void calulateCenter(){
			
		}
		public double getCenterLat(){
			return records.get(0).getLatitude();
		}
		public double getCenterLon(){
			return records.get(0).getLongitude();
		}
	}
}
