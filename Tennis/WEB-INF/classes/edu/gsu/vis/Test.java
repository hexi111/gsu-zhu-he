package edu.gsu.vis;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

public class Test {
	
	public Test(){
		ConcurrentHashMap<String, TennisMatch> TennisData = new ConcurrentHashMap<String, TennisMatch>();
		//new Crawler(TennisData);
		ScheduledExecutorService scheduler;
		scheduler = Executors.newSingleThreadScheduledExecutor();
		scheduler.scheduleAtFixedRate(new Crawler(TennisData), 0, 5, TimeUnit.SECONDS);
	}
	
	public static void main(String [] args){
		new Test();
	}
}