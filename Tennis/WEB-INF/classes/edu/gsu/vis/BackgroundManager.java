package edu.gsu.vis;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContext;
import javax.servlet.ServletContextListener;

public class BackgroundManager implements ServletContextListener{
	
	private ScheduledExecutorService scheduler;

    @Override
    public void contextInitialized(ServletContextEvent event) {
        ServletContext ctx = event.getServletContext();
    	scheduler = Executors.newSingleThreadScheduledExecutor();
    	ConcurrentHashMap<String, TennisMatch> TennisData = new ConcurrentHashMap<String, TennisMatch>();
    	ctx.setAttribute("TennisData",TennisData);
    	System.out.println("hello");
		scheduler.scheduleAtFixedRate(new Crawler(TennisData), 0, 5, TimeUnit.SECONDS);
    }

    @Override
    public void contextDestroyed(ServletContextEvent event) {
        scheduler.shutdownNow();
    }
}