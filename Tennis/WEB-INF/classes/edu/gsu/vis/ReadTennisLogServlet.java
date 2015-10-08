package edu.gsu.vis;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;

import java.net.URL;
import java.net.URLConnection;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Date;
import java.util.List;
import java.io.FileReader;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class ReadTennisLogServlet extends HttpServlet{

	private HashMap	<String,TennisMatch> matchs= new HashMap <String, TennisMatch> ();
	private List <String> patterns = new ArrayList <String> ();
	private List <Integer> kinds = new ArrayList <Integer> ();
	private HashMap <String,String> names=new HashMap <String,String>();
	
	public void init() throws ServletException {
		try{
			BufferedReader is = new BufferedReader(new FileReader(getServletContext().getRealPath("/WEB-INF/words.txt")));
			String str=is.readLine();
			while(str!=null){
				String [] pairs =new String [2];
				pairs=str.split(",");
				patterns.add(pairs[0].trim());
				kinds.add(new Integer(pairs[1].trim())); 
				str=is.readLine();
			}
			is.close();
			BufferedReader is1 = new BufferedReader(new FileReader(getServletContext().getRealPath("/WEB-INF/names.txt")));
			str=is1.readLine();
			while(str!=null){
				String [] pairs =new String [2];
				pairs=str.split(",");
				names.put(pairs[0].trim(),pairs[1].trim());
				str=is1.readLine();
			}
			is1.close();
		} catch(IOException e){
			throw new ServletException(e);
		}
	}
	
	private String extractKey(String address){
		int pos=address.indexOf("?");
		String substr=address.substring(pos+1);
		String [] pairs=substr.split("=");
		//System.out.println("address="+address);
		//System.out.println("key="+pairs[1]);
		return pairs[1];
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException{
		
		String key=extractKey(request.getParameter("address"));
		TennisMatch match=matchs.get(key);
		if(match!=null){
			//printInfo(match);
		}
		else {
			// URL for sina.com.cn tennis live data
			String sURL = "http://api.sports.sina.com.cn/?p=live&s=livecast&a=livecastlogv3&format=json&order=-1&num=50&callback=live_JSONP_DPC&dpc=1"+"&key=l_"+key+"&id="; 
			String urlID="";
			ArrayList<JsonObject> logs=new ArrayList<JsonObject> ();
			int num;
			// extract info from the json file, and store in the array of JsonObjects.
			do{
				// Connect to the URL using java's native library
				URL url = new URL(sURL+urlID);
				URLConnection connection = url.openConnection();
				BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
				StringBuilder builder=new StringBuilder();
				String tmp;
				// remove the useless char in the beginning and the end of the json file.
				while ((tmp = in.readLine()) != null) {
					tmp=tmp.replace("live_JSONP_DPC(","");
					tmp=tmp.replace(");","");
					builder.append(tmp);
				}
				JsonElement jelement = new JsonParser().parse(builder.toString());
				JsonObject  jobject = jelement.getAsJsonObject();
				jobject = jobject.getAsJsonObject("result");
				// This contains logging records.
				JsonArray jarray = jobject.getAsJsonArray("data");
				int i;
				num=jarray.size();
				for(i=0;i<jarray.size();i++){
					// records with no comments.
					if(jarray.get(i).getAsJsonObject().get("lnk")!=null){
						System.out.println("lnk record");
					}
					else{
						logs.add(jarray.get(i).getAsJsonObject());					
					}
				}
				urlID=jarray.get(jarray.size()-1).getAsJsonObject().get("id").toString();
				in.close();

			} while(num==50);
		
			match=new TennisMatch();
			// get the name of the first and the second players from the first record.
			String team1=logs.get(0).getAsJsonObject().get("team1").toString().replaceAll("\"","");
			String name1=names.get(team1);
			if(name1!=null){
				match.setPlayer1(name1);
			}
			else{
				match.setPlayer1(team1);				
			}

			String team2=logs.get(0).getAsJsonObject().get("team2").toString().replaceAll("\"","");
			String name2=names.get(team2);
			if(name2!=null){
				match.setPlayer2(name2);
			}
			else{
				match.setPlayer2(team2);				
			}
			// store the match id
			match.setId(key);
			// get the number of sets in the match
			String finalSets=logs.get(0).getAsJsonObject("s").get("d").toString();
			// System.out.println("finaSets="+finalSets);
			// removing double quotes
			String [] sets=finalSets.trim().substring(1,finalSets.length()-1).split(" ");
			int ZerosSets=0;
			for (int i=0;i<sets.length;i++){
				if(sets[i].equals("0-0")){
					ZerosSets++;
				}
			}

			int matchHost=0;
			int matchGuest=0;
			// figure out which sets the first players win and which sets the second players win. 
			// instantiate TennisSet and TennisGame objects.
			for (int i=0;i<sets.length-ZerosSets;i++){
				String [] nums=sets[i].split("-");
				int num1= new Integer(nums[0]).intValue();
				int num2= new Integer(nums[1]).intValue();
				TennisSet set=new TennisSet();
				match.addSets(set);
				set.setHost(num1);
				set.setGuest(num2);
				for(int j=0;j<(num1+num2);j++){
					TennisGame game=new TennisGame();
					TennisScore score=new TennisScore();
					game.addScores(score);
					set.addGames(game);
				}
				if(num1>num2) {
					matchHost++;
				}	
				else{
					matchGuest++;
				}
			}
			match.setHost(matchHost);
			match.setGuest(matchGuest);
		
			extractInfo(match,logs.get(logs.size()-1),logs.get(logs.size()-1),(sets.length-ZerosSets));
			for(int i=logs.size()-2;i>=0;i--){
				// fill information into the objects.
				extractInfo(match,logs.get(i),logs.get(i+1),(sets.length-ZerosSets));
			}
			filter(match);
			matchs.put(key,match);
			
			//printInfo(match);
		}
		String json = new Gson().toJson(match);
		//System.out.println("json="+json);
		response.setContentType("text/json");  
		response.setCharacterEncoding("UTF-8"); 
		response.getWriter().write(json);
	}
	
	private void extractInfo(TennisMatch match, JsonObject rec, JsonObject preRec,int numOfSets){
		
		try{
			String finalSets=rec.getAsJsonObject("s").get("d").toString();
			String [] sets=finalSets.trim().substring(1,finalSets.length()-1).split(" ");
			String scoreH=rec.getAsJsonObject("s").get("s21").toString().replaceAll("\"","");
			String scoreG=rec.getAsJsonObject("s").get("s22").toString().replaceAll("\"","");
			int scoreHost;
			int scoreGuest;
			if(scoreH.equals("A")){
				scoreHost=50;
			}
			else {
				scoreHost=new Integer(scoreH);
			}
			
			if(scoreG.equals("A")){
				scoreGuest=50;
			}
			else {
				scoreGuest=new Integer(scoreG);
			}
			
			int i;
			String comment="";
			int setIndex=0;
			int num1=-1;
			int num2=-1;
			// the case of the first set
			if(sets[0].equals("0-0")){
				if((scoreHost==0)&&(scoreGuest==0)){
					return;
				}
				setIndex=0;
			}
			// the other cases
			else {
				for (i=1;i<numOfSets;i++){
					if(sets[i].equals("0-0")){
						break;
					}
				}
				if(i==numOfSets){
					setIndex=(i-1);
				}
				else {
					String [] nums=sets[i-1].split("-");
					num1=new Integer(nums[0]);
					num2=new Integer(nums[1]);
					if((num1==7)||(num2==7)){
						setIndex=i;
					}
					else if((num1==6)&&(num2<5)) {
						setIndex=i;
					}
					else if((num2==6)&&(num1<5)) {
						setIndex=i;
					}
					else {
						setIndex=i-1;
					}
				}
			}
			
			// need the comment before the first score.
			if((scoreHost==0)&&(scoreGuest==15)){
				if(rec!=preRec){
					comment=preRec.get("m").toString().replaceAll("\"","");
				}
			}
			else if((scoreHost==15)&&(scoreGuest==0)){
				if(rec!=preRec){
					comment=preRec.get("m").toString().replaceAll("\"","");
				}
			}
			// Choose the right set.
			TennisSet set = match.getSets().get(setIndex);
			String [] nums = sets[setIndex].split("-");
			int gameHost = new Integer(nums[0]).intValue();
			int gameGuest = new Integer(nums[1]).intValue();
		
			// skip the records after the game is over.
			//if(gameHost+gameGuest+1>(set.getHost()+set.getGuest())){
			//	return;
			//}
			TennisGame game=null;
			// Choose the right game.
			if(gameHost+gameGuest==set.getHost()+set.getGuest()){
				game=set.getGames().get(gameHost + gameGuest-1);
			}
			if(gameHost+gameGuest<(set.getHost()+set.getGuest())){
				game = set.getGames().get(gameHost + gameGuest);
			}		
			/*
			if((gameHost+gameGuest)==(set.getHost()+set.getGuest())) {
				game.setHost(gameHost);
				game.setGuest(gameGuest);
			}
			*/
			//game.setHost1(gameHost);
			//game.setGuest1(gameGuest);
			
			String preScoreH=preRec.getAsJsonObject("s").get("s21").toString().replaceAll("\"","");
			String preScoreG=preRec.getAsJsonObject("s").get("s22").toString().replaceAll("\"","");
			int preScoreHost;
			int preScoreGuest;
			if(preScoreH.equals("A")){
				preScoreHost=50;
			}
			else {
				preScoreHost=new Integer(preScoreH);
			}
			
			if(preScoreG.equals("A")){
				preScoreGuest=50;
			}
			else {
				preScoreGuest=new Integer(preScoreG);
			}
			
			/*
			if((scoreHost==0)&&(scoreGuest==0)){
					if((gameHost==0)&&(gameGuest==0)) {
						set = match.getSets().get(setIndex-1);
						game= set.getGames().get(set.getGames().size()-1);
					}
					else{
						game= set.getGames().get(gameHost+gameGuest-1);
					}
			}
			*/

			ArrayList <TennisScore> scores= game.getScores();
			//System.out.println("preScoreHost="+preScoreHost+" preScoreGuest="+preScoreGuest);
			/*
			if((preScoreHost==0)&&(preScoreGuest==0)){
				//continue;
				TennisScore preScore=scores.get(scores.size()-1);
				preScore.addComments(rec.get("m").toString().replaceAll("\"",""));
			}
			else 
			*/ 
			if((scoreHost!=preScoreHost)||(scoreGuest!=preScoreGuest)){
				if((scoreHost==0)&&(scoreGuest==0)){
					if((gameHost==0)&&(gameGuest==0)) {
						set = match.getSets().get(setIndex-1);
						game= set.getGames().get(set.getGames().size()-1);
					}
					else if((setIndex==(numOfSets-1))&&((gameHost==7)||(gameGuest==7)||((gameGuest==6)&&(gameHost<5))||((gameHost==6)&&(gameGuest<5)))){
						//set = match.getSets().get(setIndex-1);
						game= set.getGames().get(set.getGames().size()-1);
						System.out.println("last point"+ " gameHost="+gameHost+" gameGuest="+gameGuest);
					}
					else{
						//set = match.getSets().get(setIndex);
						game= set.getGames().get(gameHost+gameGuest-1);
					}
					scores= game.getScores();
					if(preScoreHost>preScoreGuest){
						if(preScoreHost==50){
							scoreHost=60;
						}
						else{
							scoreHost=50;
						}
						scoreGuest=preScoreGuest;
					}
					else {
						if(preScoreGuest==50){
							scoreGuest=60;
						}
						else{
							scoreGuest=50;
						}
						scoreHost=preScoreHost;
					}
					game.setHost(scoreHost);
					game.setGuest(scoreGuest);	
				}
				
				TennisScore score=scores.get(scores.size()-1);
				score.setHost(scoreHost);
				score.setGuest(scoreGuest);
				if(!comment.equals("")) {
					score.addComments(comment);
				}
				score.addComments(rec.get("m").toString().replaceAll("\"",""));
				score.setId(new Integer(rec.get("id").toString()));
				score.setTimestamp(new Date((long)1000*new Integer(rec.get("time").toString().replaceAll("\"",""))));
				//System.out.println("id="+rec.get("id"));
				if((scoreHost!=0)||(scoreGuest!=0)){
					scores.add(new TennisScore());
				}
			}
			else{
				/*
				if(scores.size()==0){
					TennisScore score=new TennisScore();
					score.setHost(scoreHost);
					score.setGuest(scoreGuest);
				}
				else {
				*/
					//System.out.println("setIndex="+setIndex);
					//System.out.println("gameHost="+gameHost+" gameGuest "+gameGuest);
					//System.out.println("preScoreHost="+preScoreHost+" preScoreGuest "+preScoreGuest);
					//System.out.println("scoreHost="+scoreHost+" scoreGuest "+scoreGuest);
					//System.out.println("size="+scores.size());
				if((scoreHost==0)&&(scoreGuest==0)){
				}
				else{
					TennisScore preScore=scores.get(scores.size()-1);
					preScore.addComments(rec.get("m").toString().replaceAll("\"",""));
				}
				//}
			}

		}catch(Exception e){
			e.printStackTrace();
		}
	}

	private void filter(TennisMatch match){
		int i,j,k,g;
		for(i=0;i<match.getSets().size();i++){
			TennisSet set= match.getSets().get(i);
			for(j=0;j<set.getGames().size();j++){
				TennisGame game = set.getGames().get(j);
				for(k=0;k<game.getScores().size();k++){
					TennisScore score=game.getScores().get(k);
					if((score.getHost()==60)||(score.getGuest()==60)){
						break;
					}
					if((score.getHost()==50)&&(score.getGuest()<40)){
						break;
					}
					if((score.getGuest()==50)&&(score.getHost()<40)){
						break;
					}
				}
				//System.out.println("i="+i+" j="+j+" k="+k);
				int num=0;
				if(k==game.getScores().size()){
				}
				else{
					num=game.getScores().size()-1-k;
					for(k=0;k<num;k++){
						game.getScores().remove(game.getScores().size()-1);
					}
				}
				TennisScore tmp=game.getScores().get(game.getScores().size()-1);
				if((tmp.getHost()==0)&&(tmp.getGuest()==0)){
					game.getScores().remove(game.getScores().size()-1);
				}
				//System.out.println("size="+game.getScores().size()+" num="+num);
				if(game.getScores().size()>1){
					tmp=game.getScores().get(game.getScores().size()-1);
				}
				game.setHost(tmp.getHost());
				game.setGuest(tmp.getGuest());
				if(game.getHost()>game.getGuest()){
					game.setWinner(0);
				}
				else{
					game.setWinner(1);
				}
				game.end=tmp.getTimestamp();
				tmp=game.getScores().get(0);
				game.start=tmp.getTimestamp();	
			}
		}

		int pre=0;
		
		for(i=0;i<match.getSets().size();i++){
			TennisSet set= match.getSets().get(i);
			for(j=0;j<set.getGames().size();j++){
				set.getGames().get(j).setServer(1-pre);	
				pre=1-pre;
			}
		}
				
		for(i=0;i<match.getSets().size();i++){
			TennisSet set= match.getSets().get(i);
			for(j=0;j<set.getGames().size();j++){
				TennisGame game = set.getGames().get(j);
				for(k=0;k<game.getScores().size();k++){
					TennisScore score= game.getScores().get(k);
					ArrayList <String> comments = score.getComments();
					//System.out.println(comments.get(comments.size()-1));
					String comment = comments.get(comments.size()-1);
					if(k==0){
						if(score.getHost()==0){
							score.setScore(1);
						}
						else{
							score.setScore(0);
						}
					}
					else{
						TennisScore last=game.getScores().get(k-1);
						if(score.getHost()==last.getHost()){
							score.setScore(1);
						}
						else{
							score.setScore(0);
						}
					}
					int size=patterns.size();
					for(g=0;g<size;g++){
						if(comment.indexOf(patterns.get(g))!=-1){
							switch(kinds.get(g)){
								case 0: score.setAce(game.getServer());break;
								case 1: score.setDoubleFault(game.getServer());break;
								case 2: score.setVolley(score.getScore());break;
								case 3: break;
							}
						}
					}
				}
			}
		}
	}
	
	/*
	private void extractFeature(TennisMatch match){
		int i,j,k,g;
		for(i=0;i<match.getSets().size();i++){
			TennisSet set= match.getSets().get(i);
			for(j=0;j<set.getGames().size();j++){
				TennisGame game = set.getGames().get(j);
				for(k=0;k<game.getScores().size();k++){
					TennisScore score=game.getScores().get(k);
					for(g=0;g<score.getComments().size();g++){
						String comment=score.getComments().get(g);
						if(comment.indexOf("ACE")!=-1){
							score.setACE(1);
							break;
						}
					}
				}
			}
		}
	}
	*/
	
	private void printInfo(TennisMatch match){
		System.out.println("Match id is "+ match.getId()+"( "+match.getHost()+" : "+match.getGuest()+" )");
		int i,j,k,g;
		for(i=0;i<match.getSets().size();i++){
			TennisSet set= match.getSets().get(i);
			System.out.println("\t************* "+(i+1)+"th set ( "+ set.getHost()+" : "+set.getGuest()+" ) *************");
			for(j=0;j<set.getGames().size();j++){
				TennisGame game = set.getGames().get(j);
				System.out.println("\t\t************* "+(j+1)+"th game ( "+ game.getHost()+" : "+game.getGuest()+" ) *************");	
				for(k=0;k<game.getScores().size();k++){
					TennisScore score=game.getScores().get(k);
					System.out.println("\t\t\t************* "+(k+1)+"th score ( "+ score.getHost()+" : "+score.getGuest()+" ) *************");						
					for(g=0;g<score.getComments().size();g++){
						System.out.println("\t\t\t\t "+score.getComments().get(g));
					}
				}
			}
		}
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException{
		doGet(request,response);
	}
	
	private class TennisMatch {
		private String player1;
		private String player2;
		private int host;
		private int guest;
		private ArrayList <TennisSet> sets=new ArrayList <TennisSet>();
		private String id;
		
		public String getId(){
			return id;
		}
		
		public void setId(String id){
			this.id=id;
		}
		
		public ArrayList <TennisSet> getSets(){
			return this.sets;
		}
		
		public void addSets(TennisSet set){
			this.sets.add(set);
		}
		
		public int getHost(){
			return host;
		}
		
		public void setHost(int host){
			this.host=host;
		}
		
		public int getGuest(){
			return guest;
		}
		
		public void setGuest(int guest){
			this.guest=guest;
		}
		
		public String getPlayer1(){
			return this.player1;
		}
		
		public void setPlayer1(String player1){
			this.player1=player1;
		}
		
		public String getPlayer2(){
			return this.player2;
		}
		
		public void setPlayer2(String player2){
			this.player2=player2;
		}
	}
	
	private class TennisSet {
		private int host;
		private int guest;
		private ArrayList <TennisGame> games=new ArrayList <TennisGame>();	
		
		public ArrayList <TennisGame> getGames(){
			return this.games;
		}
		public void addGames(TennisGame game){
			this.games.add(game);
		}
		
		public int getHost() {
			return this.host;
		}	
		public void setHost(int host){
			this.host=host;
		}
		public int getGuest(){
			return this.guest;
		}
		public void setGuest(int guest){
			this.guest=guest;
		}
	}

	private class TennisGame {
		private int host;
		private int guest;
		// current game score.
		private int host1;
		private int guest1;
		private ArrayList <TennisScore> scores=new ArrayList <TennisScore>();				
		
		private int winner;
		private Date start;
		private Date end;
		private int server; // 0: host; 1: guest

				
		public int getServer(){
			return server;
		}
		public void setServer(int server){
			this.server=server;
		}
		
		public Date getStart(){
			return start;
		}
		
		public void setStart(Date start){
			this.start=start;
		}
		
		public Date getEnd(){
			return this.end;
		}
		
		public void setEnd(Date end){
			this.end=end;
		}
		
		public int getWinner(){
			return winner;
		} 
		
		public void setWinner(int winner){
			this.winner=winner;
		}
		 
		public ArrayList <TennisScore> getScores(){
			return this.scores;
		}
		public void addScores(TennisScore score){
			this.scores.add(score);
		}
		
		public int getHost(){
			return host;
		}
		
		public void setHost(int host){
			this.host=host;
		}		
		
		public int getHost1(){
			return host1;
		}
		
		public void setHost1(int host1){
			this.host1=host1;
		}

		public int getGuest1(){
			return guest1;
		}
		
		public void setGuest1(int guest1){
			this.guest1=guest1;
		}

		public int getGuest(){
			return guest;
		}
		
		public void setGuest(int guest){
			this.guest=guest;
		}
		
	}
	
	private class TennisScore {
		
		//private int id;
		private ArrayList <String> comments=new ArrayList<String>();		
		private int host;
		private int guest;
		private int id;
		private Date timestamp;
		private int score; // 0:host; 1:guest
		private int ace; // 0:host; 1:guest -1:none
		private int doubleFault; // 0:host; 1:guest -1:none
		private int volley; // 0:host; 1:guest -1:none
		
		public TennisScore(){
			this.ace=-1;
			this.doubleFault=-1;
			this.volley=-1;
		}
		
		public void setVolley(int volley){
			this.volley=volley;
		}
		
		public int getVolley(int volley){
			return this.volley;
		}
		
		public void setScore(int score){
			this.score=score;
		}
		
		public int getScore(){
			return this.score;
		}
		
		public void setDoubleFault(int doubleFault){
			this.doubleFault=doubleFault;
		}
		
		public int getDoubleFault(){
			return this.doubleFault;
		}
		
		public void setAce(int ace){
			this.ace = ace;
		}
		
		public int getAce(){
			return this.ace;
		}
		
		public Date getTimestamp(){
			return this.timestamp;
		}
		
		public void setTimestamp(Date timestamp){
			this.timestamp=timestamp;
		}
		
		public int getId(){
			return this.id;
		}
		public void setId(int id){
			this.id=id;
		}
				
		public ArrayList <String> getComments(){
			return this.comments;
		}
		public void addComments(String comment){
			this.comments.add(comment);
		}
		
		public int getHost(){
			return host;
		}
		
		public void setHost(int host){
			this.host=host;
		}
		
		public int getGuest(){
			return guest;
		}
		
		public void setGuest(int guest){
			this.guest=guest;
		}
	}
}