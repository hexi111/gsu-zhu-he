package edu.gsu.storygraph;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.util.Scanner;

public class AFGReader {

	public static void main(String [] args) {
		
		try{
			BufferedReader fp=new BufferedReader(new FileReader(".."+File.separator+"data"+File.separator+"afg.csv"));
			BufferedWriter bw=new BufferedWriter(new FileWriter(".."+File.separator+"data"+File.separator+"afg_output.csv"));
			//System.out.println("the first line is "+fp.readLine());
			String str=fp.readLine();
			int seq=0;
			bw.write("year"+",");
			bw.write("month"+",");
			bw.write("day"+",");
			bw.write("hours"+",");
			bw.write("mins"+",");
			bw.write("date1"+",");
			bw.write("date2");
			bw.write(",");
			bw.write("type");
			bw.write(",");
			bw.write("category");
			bw.write(",");
			bw.write("latitude");
			bw.write(",");
			bw.write("longitude");
			bw.newLine();
			while(str!=null){
				Scanner s =new Scanner(str);
				String theDate;
				s.useDelimiter(",");
				if(s.hasNext()){
					theDate=s.next();
				}
				else{
					str=fp.readLine();
					continue;
				}	
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
				String year="20"+theDate.substring(loc1+1,loc1+3);
				int loc2=theDate.indexOf(":");
				String hours=theDate.substring(loc1+4,(loc2));
				if(hours.length()==1){
					hours="0"+hours;
				}
				String mins=theDate.substring((loc2+1));
				String formattedDate=month+"/"+day+"/"+year+" "+hours+":"+mins;
				//System.out.println("month="+month+" day="+day+" year="+year);				
				//System.out.println("Date: "+s.next());
				//System.out.println("Type: "+s.next());
				//System.out.println("Category: "+s.next());
				
				String type;
				if(s.hasNext()){
					type=s.next();
				}
				else{
					str=fp.readLine();
					continue;
				}
				String category;
				if(s.hasNext()){
					category=s.next();
				}	
				else{
					str=fp.readLine();
					continue;
				}	
				String latitude;	
				if(s.hasNext()){
					latitude=s.next();
				}	
				else{
					str=fp.readLine();
					continue;
				}	
				String longitude;
				if(s.hasNext()){
					longitude=s.next();
				}	
				else{
					str=fp.readLine();
					continue;
				}
				if((year.equals("2004"))&&(month.equals("01"))){	
					bw.write(year+",");
					bw.write(month+",");
					bw.write(day+",");
					bw.write(hours+",");
					bw.write(mins+",");
					bw.write(formattedDate+",");
					bw.write(theDate);
					bw.write(",");
					bw.write(type);
					bw.write(",");
					bw.write(category);
					bw.write(",");
					bw.write(latitude);
					bw.write(",");
					bw.write(longitude);
					bw.newLine();
					str=fp.readLine();
					seq++;
				}
				else{
					str=fp.readLine();
					continue;
				}
				//System.out.println("seq="+seq);
				//break;
			}
			fp.close();
			bw.close();
		}
		catch(IOException e){
			System.out.println("File not found!");
		}
	}	
}