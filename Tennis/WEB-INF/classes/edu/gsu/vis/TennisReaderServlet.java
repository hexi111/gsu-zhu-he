package edu.gsu.vis;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;

import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Collections;
import java.util.Comparator;
import java.io.IOException;
import java.io.FileReader;
import java.io.BufferedReader;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class TennisReaderServlet extends HttpServlet{
		
	private List <TennisMatch> matches = new ArrayList <TennisMatch> ();
	private Res result = new Res();
	
	private class Res{
		List <AA> output = new ArrayList<AA>();
		List <AAA> output1 = new ArrayList<AAA>();		
		List <AAAA> output2 = new ArrayList<AAAA>();		
	} 
	
	public void init() throws ServletException {
		build();
		buildTournament();
		buildTournament1();
		buildTournament2();
		detectCriticalMoment();
		genMatchReport();
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException{
		String type = request.getParameter("type");
		//System.out.println("type="+type);
		if(type.equals("0")){
			System.out.println("id="+Integer.valueOf(request.getParameter("id")));
			String json = new Gson().toJson(matches.get(Integer.valueOf(request.getParameter("id"))));
			response.setContentType("text/json");  
			response.setCharacterEncoding("UTF-8"); 
			response.getWriter().write(json);
		}
		else{
			String json = new Gson().toJson(result);
			response.setContentType("text/json");  
			response.setCharacterEncoding("UTF-8"); 
			response.getWriter().write(json);
		}
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException{
		doGet(request,response);	
	}

	public void buildTournament(){
		
		HashMap <String, Tournament> tournaments = new HashMap <String, Tournament> ();
		for(TennisMatch t:matches){
			if(tournaments.containsKey(t.tournament)){
				Tournament tmp = tournaments.get(t.tournament);
				if(tmp.meetings.containsKey(t.year)){
					tmp.meetings.get(t.year).matches.add(t);	
				}
				else{
					YearTournament yt = new YearTournament();
					yt.matches.add(t);
					tmp.meetings.put(t.year, yt);
				}
			}
			else{
				YearTournament yt1 = new YearTournament();
				yt1.matches.add(t);
				Tournament t1 = new Tournament();
				t1.meetings.put(t.year,yt1); 
				tournaments.put(t.tournament,t1);
			}
		}
		/*
		System.out.println("match size = "+matches.size()+" tournament size = " + tournaments.keySet().size());
		Iterator<String> iter = tournaments.keySet().iterator();
		while(iter.hasNext()){
			System.out.println(iter.next());
		}
		*/
		Iterator<String> iter = tournaments.keySet().iterator();
		//List <AA> output = new ArrayList<AA>();
		while(iter.hasNext()){
			AA aa = new AA();
			result.output.add(aa);
			aa.name = iter.next();
			Tournament tt1 = tournaments.get(aa.name);
			Iterator<Integer> iterTmp = tt1.meetings.keySet().iterator();
			while(iterTmp.hasNext()){
				BB bb = new BB();
				aa.bs.add(bb);
				bb.year = iterTmp.next();
				for(TennisMatch ts:tt1.meetings.get(bb.year).matches){
					CC cc = new CC();
					bb.cs.add(cc);
					cc.player1 = ts.player1;
					cc.player2 = ts.player2;
					cc.matchId = ts.matchId;
				}
			}
		}
		for(AA a:result.output){
			Collections.sort(a.bs,new Comparator<BB>(){ public int compare(BB b1, BB b2){return (b1.year - b2.year);}});		
		}
		Collections.sort(result.output,new Comparator<AA>(){ public int compare(AA a1, AA a2){return a1.name.compareTo(a2.name);}});
	}

	public void buildTournament1(){
		
		HashMap <Integer, TournamentInYears> tournaments = new HashMap <Integer, TournamentInYears> ();
		
		for(TennisMatch t:matches){
			if(tournaments.containsKey(t.year)){
				if(tournaments.get(t.year).meetings.containsKey(t.tournament)){
					tournaments.get(t.year).meetings.get(t.tournament).matches.add(t);
				}
				else{
					MatchesInTournament tmp = new MatchesInTournament();
					tmp.matches.add(t);
					tournaments.get(t.year).meetings.put(t.tournament,tmp);
				}
			}
			else{
				TournamentInYears tmp = new TournamentInYears();
				tmp.year = t.year;
				MatchesInTournament tmp1 = new MatchesInTournament();
				tmp1.matches.add(t);
				tmp.meetings.put(t.tournament,tmp1);
				tournaments.put(t.year,tmp);
			}			
		}
		
		Iterator <Integer> years = tournaments.keySet().iterator();
		while(years.hasNext()){
			AAA a = new AAA();
			result.output1.add(a);
			int year = years.next();
			a.year = year;
			TournamentInYears tour = tournaments.get(year);
			Iterator<String> names = tour.meetings.keySet().iterator();
			while(names.hasNext()){
				BBB b = new BBB();
				a.bs.add(b);
				String name = names.next();
				b.name = name;
				MatchesInTournament tmp =tour.meetings.get(name);
				for(TennisMatch ts:tmp.matches){
					CCC c = new CCC();
					b.cs.add(c);
					c.player1 = ts.player1;
					c.player2 = ts.player2;
					c.matchId = ts.matchId;
				}
			}
		}
		
		for(AAA a:result.output1){
			Collections.sort(a.bs,new Comparator<BBB>(){ public int compare(BBB b1, BBB b2){return b1.name.compareTo(b2.name);}});		
		}
		Collections.sort(result.output1,new Comparator<AAA>(){ public int compare(AAA a1, AAA a2){return a1.year-a2.year;}});

	}
	
	public void buildTournament2(){
		HashMap <String, TournamentByAthletes> tournaments = new HashMap <String, TournamentByAthletes> ();	
		
		for(TennisMatch t:matches){	
			if(tournaments.containsKey(t.player1)){
				if(tournaments.get(t.player1).meetings.containsKey(t.tournament+t.year)){
					tournaments.get(t.player1).meetings.get(t.tournament+t.year).matches.add(t);
				}
				else{
					MatchesInTournamentYear tmp = new MatchesInTournamentYear();
					tmp.matches.add(t);
					tmp.name = t.tournament;
					tmp.year = t.year;
					tournaments.get(t.player1).meetings.put(t.tournament+t.year,tmp);
				}
			}
			else{
				TournamentByAthletes tmp = new TournamentByAthletes();
				tmp.name = t.player1;
				MatchesInTournamentYear tmp1 = new MatchesInTournamentYear();
				tmp1.name = t.tournament;
				tmp1.year = t.year;
				tmp1.matches.add(t);
				tmp.meetings.put(t.tournament+t.year,tmp1);
				tournaments.put(t.player1,tmp);
			}
			
			if(tournaments.containsKey(t.player2)){
				if(tournaments.get(t.player2).meetings.containsKey(t.tournament+t.year)){
					tournaments.get(t.player2).meetings.get(t.tournament+t.year).matches.add(t);
				}
				else{
					MatchesInTournamentYear tmp = new MatchesInTournamentYear();
					tmp.matches.add(t);
					tmp.name = t.tournament;
					tmp.year = t.year;
					tournaments.get(t.player2).meetings.put(t.tournament+t.year,tmp);
				}
			}
			else{
				TournamentByAthletes tmp = new TournamentByAthletes();
				tmp.name = t.player2;
				MatchesInTournamentYear tmp1 = new MatchesInTournamentYear();
				tmp1.name = t.tournament;
				tmp1.year = t.year;
				tmp1.matches.add(t);
				tmp.meetings.put(t.tournament+t.year,tmp1);
				tournaments.put(t.player2,tmp);
			}			
		}
				
		Iterator<String> iter = tournaments.keySet().iterator();
		while(iter.hasNext()){
			AAAA a = new AAAA();
			result.output2.add(a);
			String name = iter.next();
			a.name = name;
			TournamentByAthletes tour = tournaments.get(name);
			Iterator<String> names = tour.meetings.keySet().iterator();
			MatchesInTournamentYear tmpMIT = null;
			while(names.hasNext()){
				BBBB b = new BBBB();
				a.bs.add(b);
				String nameTmp = names.next();
				tmpMIT =tour.meetings.get(nameTmp);
				b.year = tmpMIT.year;
				b.tournament = tmpMIT.name;
				for(TennisMatch t:tmpMIT.matches){
					CCCC c = new CCCC();
					b.cs.add(c);
					c.player1 = t.player1;
					c.player2 = t.player2;
					c.matchId = t.matchId;
				}
			}
			TennisMatch tm = tmpMIT.matches.get(0);
			if(tm.player1.equals(name)){
				a.sortName = tm.lastname1+", "+tm.firstname1;
				a.firstname = tm.firstname1;
				a.lastname = tm.lastname1;
			}
			else{
				a.sortName = tm.lastname2+", "+tm.firstname2;
				a.firstname = tm.firstname2;
				a.lastname = tm.lastname2;
			}
		}
		for(AAAA a:result.output2){
			Collections.sort(a.bs,new Comparator<BBBB>(){ public int compare(BBBB b1, BBBB b2){return (b1.tournament+b1.year).compareTo(b2.tournament+b2.year);}});		
		}
		Collections.sort(result.output2,new Comparator<AAAA>(){ public int compare(AAAA a1, AAAA a2){return a1.sortName.compareTo(a2.sortName);}});
	}

	private class AAAA{
		String name;
		String sortName;
		String firstname;
		String lastname;
		List <BBBB> bs = new ArrayList<BBBB>();
	}
	
	private class BBBB{
		int year;
		String tournament;
		List <CCCC> cs = new ArrayList<CCCC>();
	}
	
	private class CCCC{
		String player1;
		String player2;
		int matchId;
	}

	private class TournamentByAthletes{
		String name;
		HashMap <String, MatchesInTournamentYear> meetings = new HashMap <String, MatchesInTournamentYear> ();
	}

	private class MatchesInTournamentYear{
		String name;
		int year;
		List <TennisMatch> matches = new ArrayList <TennisMatch> ();
	}
	
	private class AA{
		String name;
		List <BB> bs = new ArrayList <BB>();	
	}
	
	private class BB{
		int year;
		List <CC> cs = new ArrayList <CC> ();
	}
	
	private class CC{
		String player1;
		String player2;
		int matchId;
	}
	
	private class AAA{
		int year;
		List <BBB> bs = new ArrayList <BBB>();	
	}

	private class BBB{
		String name;
		List <CCC> cs = new ArrayList <CCC> ();
	}
	
	private class CCC{
		String player1;
		String player2;
		int matchId;
	}
	
	private class Tournament{
		String name;
		HashMap <Integer, YearTournament> meetings = new HashMap <Integer, YearTournament> ();
	}

	private class YearTournament{
		List <TennisMatch> matches = new ArrayList <TennisMatch> ();
	}	

	private class TournamentInYears{
		int year;
		HashMap <String, MatchesInTournament> meetings = new HashMap <String, MatchesInTournament> ();
	}

	private class MatchesInTournament{
		List <TennisMatch> matches = new ArrayList <TennisMatch> ();		
	}
		
	private class TennisMatch {
		int host;
		int guest;
		String player1 = "AAA";
		String player2 = "BBB";
		String firstname1;
		String lastname1;
		String firstname2;
		String lastname2;
		List <TennisSet> sets = new ArrayList <TennisSet>();
		int matchId = 0;
		String date;
		String tournament;
		int year;
		int maxRally;
		List <String> matchReport = new ArrayList <String> ();
		List <CriticalMoment> CMs = new ArrayList <CriticalMoment> ();
	}
	
	private class TennisSet {
		int host;
		int guest;
		int winner = 0; // 0: host: 1: guest;
		List <TennisGame> games = new ArrayList <TennisGame>();	
	}
	
	private class TennisGame {
		int host;
		int guest;
		List <TennisScore> scores=new ArrayList <TennisScore>();					
		int serving; // 0: host; 1: guest;
		int winner; // 0: host; 1: guest;
		int start;
		int end;
		int tiebreak = 0; // 0: no. 1: yes.
		int host1 = 0;
		int guest1 = 0;
		int startShot;
		int endShot;
	}
	
	private class ALine{
		int seq;
		int set1;
		int set2;
		int game1;
		int game2;
		int host;
		int guest;
		String date;
		String tournament;
		String round;
		String hostFirstName;
		String hostLastName;
		String guestFirstName;
		String guestLastName;
		String one;
		String sec;
		int serving;
		public void print(){
			//System.out.println(set1+","+set2+","+game1+","+game2);
		}
	}
	
	public void build() throws ServletException{
		try{
			//BufferedReader br = new BufferedReader(new FileReader("charting-m-points.csv"));
			BufferedReader br = new BufferedReader(new FileReader(getServletContext().getRealPath("/WEB-INF/charting-m-points.csv")));
			String line = br.readLine();
			line = br.readLine();
			ALine obj = new ALine();
			TennisScore currentScore = null;
			TennisGame currentGame = new TennisGame();
			TennisSet currentSet = new TennisSet();
			TennisMatch currentMatch = null;
			int lineNum = 0;
			int preHost = 0;
			int preGuest = 0;
			int serving = 0;
			String one = "";
			String sec = "";
			int order = 0;
			currentGame.start = 1;
			int maxRally = 1;
			int matchId = 0;
			while(line!=null){
				//System.out.println("order="+order);
				lineNum++;
				parse(obj,line);
				if(obj.seq == 1){
					if(lineNum == 1){
						currentMatch = new TennisMatch();
						currentMatch.matchId = matchId;
						matchId++;
						currentMatch.date = obj.date.substring(0,4)+"-"+obj.date.substring(4,6)+"-"+obj.date.substring(6,8);
						currentMatch.player1 = obj.hostFirstName+" "+ obj.hostLastName;
						currentMatch.player2 = obj.guestFirstName+" "+ obj.guestLastName;
						currentMatch.firstname1 = obj.hostFirstName;
						currentMatch.lastname1 = obj.hostLastName;
						currentMatch.firstname2 = obj.guestFirstName;
						currentMatch.lastname2 = obj.guestLastName;
						currentMatch.tournament = obj.tournament;
						currentMatch.year = Integer.valueOf(obj.date.substring(0,4));
						line = br.readLine();
						one = obj.one;
						sec = obj.sec;
						serving = obj.serving;	
						continue;
					}
					//if(matches.size() == 0){
					//	System.out.println("line = "+line);
					//}
					// matches.add(currentMatch);
					// currentMatch = new TennisMatch();
				}
				order ++;
				currentScore = new TennisScore();
				currentScore.serving = serving;
				interpret(one, sec, currentScore, currentMatch);
				maxRally = maxRally > currentScore.rally ? maxRally : currentScore.rally;
				currentScore.seq = order;	
				if(obj.host == 0 && obj.guest == 0){	
					if(preHost == 50){
						preHost = 60;
					}
					else if(preGuest == 50){
						preGuest = 60;
					}
					else if(preHost == 40){
						preHost = 60;
					}
					else if(preGuest == 40){
						preGuest = 60;
					}
					// Tiebreak
					else if(preGuest == 7){
						preGuest = 8;
					}
					else if(preHost == 7){
						preHost = 8;
					}
					else if(preGuest == 6){
						preGuest = 8;
					}
					else if(preHost == 6){
						preHost = 8;
					}
					/*
					else{
						if(preHost > preGuest){
							preHost ++;
						}
						else{
							preGuest ++;
						}
					}
					*/
					currentScore.host = preHost;
					currentScore.guest = preGuest;
					currentGame.scores.add(currentScore);
					if(preHost > preGuest){
						currentGame.winner = 0;
					}
					else{
						currentGame.winner = 1;
					}
					currentGame.serving = serving;
					currentGame.host = preHost;
					currentGame.guest = preGuest;
					currentSet.games.add(currentGame);
					currentGame.end = order;
					if(obj.game1 == 0 && obj.game2 == 0){
						order = 0;
						int hostGame = 0, guestGame = 0;
						for(TennisGame g: currentSet.games){
							if(g.winner == 0){
								hostGame ++;
							}
							else{
								guestGame ++;
							}
						}
						currentSet.host = hostGame;
						currentSet.guest = guestGame;
						if((currentSet.host == 6 && currentSet.guest == 7)||(currentSet.host == 7 && currentSet.guest == 6)) {
							currentGame.tiebreak = 1;
						}
						currentMatch.sets.add(currentSet);
						if(obj.seq == 1){
							int hostSet = 0, guestSet = 0;
							for(TennisSet s:currentMatch.sets){
								if(s.host > s.guest){
									hostSet ++;
								}
								else{
									guestSet ++;
								}
							}
							currentMatch.host = hostSet;
							currentMatch.guest = guestSet;
							matches.add(currentMatch);
							currentMatch.maxRally = maxRally;
							currentMatch = new TennisMatch();
							currentMatch.matchId = matchId;
							matchId++;
							maxRally = 1;
							currentMatch.date = obj.date.substring(0,4)+"-"+obj.date.substring(4,6)+"-"+obj.date.substring(6,8);
							currentMatch.player1 = obj.hostFirstName+" "+ obj.hostLastName;
							currentMatch.player2 = obj.guestFirstName+" "+ obj.guestLastName;
							currentMatch.firstname1 = obj.hostFirstName;
							currentMatch.lastname1 = obj.hostLastName;
							currentMatch.firstname2 = obj.guestFirstName;
							currentMatch.lastname2 = obj.guestLastName;
							currentMatch.tournament = obj.tournament;
							currentMatch.year = Integer.valueOf(obj.date.substring(0,4));
						}
						if(currentSet.host > currentSet.guest){
							currentSet.winner = 0;
						}
						else{
							currentSet.winner = 1;
						}
						currentSet = new TennisSet();
					}
					currentGame = new TennisGame();
					currentGame.start = order + 1;
				}
				else{
					if(obj.host > 6 && obj.guest > 6 && obj.host != 15 && obj.host != 30 && obj.host != 40 && obj.host != 50){
						if(obj.host == obj.guest){
							currentScore.host = 6;
							currentScore.guest = 6;
						}
						else if(obj.host > obj.guest){
							currentScore.host = 7;
							currentScore.guest = 6;
						}
						else{
							currentScore.host = 6;
							currentScore.guest = 7;
						}	
					}
					else{
						currentScore.host = obj.host;
						currentScore.guest = obj.guest;
					}
					currentGame.scores.add(currentScore);
				}
				line = br.readLine();
				preHost = currentScore.host;
				preGuest = currentScore.guest;
				serving = obj.serving;	
				one = obj.one;
				sec = obj.sec;	
				//System.out.println("one=|"+one+"| sec=|"+sec+"|");		
			}
			one = obj.one;
			sec = obj.sec;
		}
		catch(Exception e){
			throw new ServletException(e);
			//System.out.println("IO Error!");
		}
	}
	
	public void parse(ALine obj, String line){
		String [] properties = line.split(",");
		String [] matchInfo = properties[0].split("-");
		obj.date = matchInfo[0];
		//obj.tournament = matchInfo[2]+obj.date.substring(0,4);
		obj.tournament = matchInfo[2].replaceAll("_"," ");
		
		obj.round = matchInfo[3];
		obj.hostFirstName = matchInfo[4].split("_")[0];
		obj.hostLastName = matchInfo[4].split("_")[1];
		obj.guestFirstName = matchInfo[5].split("_")[0];
		obj.guestLastName = matchInfo[5].split("_")[1];
		obj.seq= Integer.valueOf(properties[1]);
		obj.set1 = Integer.valueOf(properties[2]);
		obj.set2 = Integer.valueOf(properties[3]);
		obj.game1 = Integer.valueOf(properties[4]);
		obj.game2 = Integer.valueOf(properties[5]);
		String pts = properties[6];
		String[] scores = pts.split("-");
		String hostInit = obj.hostFirstName.charAt(0)+""+obj.hostLastName.charAt(0);
		String guestInit = obj.guestFirstName.charAt(0)+""+obj.guestLastName.charAt(0);
		if(hostInit.equals(properties[13])){
			obj.host = scores[0].equals("AD") ? 50 : Integer.valueOf(scores[0]);
			obj.guest = scores[1].equals("AD") ? 50 : Integer.valueOf(scores[1]);
			obj.serving = 0;
		}
		else{
			obj.guest = scores[0].equals("AD") ? 50 : Integer.valueOf(scores[0]);
			obj.host = scores[1].equals("AD") ? 50 : Integer.valueOf(scores[1]);
			obj.serving = 1;
		}

		obj.one = properties[14];
		obj.sec = properties[15];
		//obj.print();
	}
	
	private class TennisScore{
		int host;
		int guest;
		int seq;
		int bpoints1 = 0;
		int gpoints1 = 0;
		int spoints1 = 0;
		int mpoints1 = 0;
		int bpoints2 = 0;
		int gpoints2 = 0;
		int spoints2 = 0;
		int mpoints2 = 0;
		boolean ace = false;
		int serving = 0;
		int winner = 0; // who win this point. 0 : host; 1:guest;
		boolean firstServingFault = false;
		boolean doubleFaults = false;
		int faultReason = 0;
		int error;
		int rally;
		int serveDirection = 0;
		String comments;
		int fcount1 = 0;
		int bcount1 = 0;
		int rcount1 = 0;
		int scount1 = 0;
		int vcount1 = 0;
		int zcount1 = 0;
		int ocount1 = 0;
		int pcount1 = 0;
		int ucount1 = 0;
		int ycount1 = 0;
		int lcount1 = 0;
		int mcount1 = 0;
		int hcount1 = 0;
		int icount1 = 0;
		int jcount1 = 0;
		int kcount1 = 0;
		int tcount1 = 0;

		int fcount2 = 0;
		int bcount2 = 0;
		int rcount2 = 0;
		int scount2 = 0;
		int vcount2 = 0;
		int zcount2 = 0;
		int ocount2 = 0;
		int pcount2 = 0;
		int ucount2 = 0;
		int ycount2 = 0;
		int lcount2 = 0;
		int mcount2 = 0;
		int hcount2 = 0;
		int icount2 = 0;
		int jcount2 = 0;
		int kcount2 = 0;
		int tcount2 = 0;
		String hoffset="";
		String moffset="";
		String soffset="";
	}
	
	public void interpret(String one, String sec, TennisScore score, TennisMatch currentMatch){
		//System.out.println("one="+one+" sec="+sec);
		
		// f: forehand; b: backhand; 
		// r: forehand slice; s: backhand slice;  
		// v: forehand volley; z: backhand volley;
		// o: standard overhead/smash; p: backhand overhead/smash;
		// u: forehand drop shot; y: backhand drop shot;
		// l: forehand lob; m: backhand lob;
		// h: forehand half-volley; i: backhand half-volley;
		// j: forehand swinging volley; k:backhand swinging volley;
		// t: trick shots
		int rally = 1; 		
		
		boolean serving = score.serving == 0 ? false : true;
		boolean firstServingFault = false;
		boolean doubleFaults = false;
		boolean ace = false;
		int faultReason = 0;
		int error = 0;
		int serveDirection = 0;
		
		char [] chs = null;
		if(sec.trim().length() != 0){
			firstServingFault = true;
			chs = sec.toCharArray();
		}
		else{
			chs = one.toCharArray();
		}
		int i = 0;
		
		String comments = "";
		if(score.serving == 0){
			comments += currentMatch.player1 + " serves.";
		}
		else{
			comments += currentMatch.player2 + " serves.";		
		}
		if(firstServingFault){
			comments+="1st serve ";
			switch(one.charAt(0)){
				case '4': comments+="wide, ";break;
				case '5': comments+="to body, ";break;
				case '6': comments+="down the T, ";break;
			}
			comments+="fault (";
			switch(one.charAt(one.length()-1)){
				case 'n': comments+="net";break;
				case 'w': comments+="wide";break;
				case 'd': comments+="long";break;
				case 'x': comments+="wide and long";break;
			}
			comments+="). ";
		}
		if(firstServingFault){
			comments+="2nd serve ";
		}
		else{
			comments+="1st serve ";
		}
		
		while(i<chs.length){
			switch(chs[i++]){
				case '4': 
				case '5': 
				case '6':
					if(chs[i-1] == '4'){
						comments +="wide";
						serveDirection = 4;
					} 
					else if (chs[i-1] == '5'){
						comments +="body";
						serveDirection = 5;
					}
					else if (chs[i-1] == '6'){
						comments +="down the T";
						serveDirection = 6;
					}
					if(i<chs.length && (chs[i] == 'n' || chs[i] == 'w' || chs[i] == 'd' || chs[i] =='x')){
						i++;
						//if(firstServingFault) {
							doubleFaults = true;
						comments += ", fault (";
						switch(one.charAt(one.length()-1)){
							case 'n': comments+="net";break;
							case 'w': comments+="wide";break;
							case 'd': comments+="long";break;
							case 'x': comments+="wide and long";break;
						}
						comments += "), double fault. ";
						//}
					} 
					else if(i<chs.length && chs[i] == '*'){
						comments +=", ace. ";
						ace = true;
					}
					else{
						comments +="; ";
					}
					break;
				case 'f': 
					rally ++;
					if(serving) {
						score.fcount1++;
						serving = false;
					}
					else{
						score.fcount2++;
						serving = true;
					}
					comments += "forehand; ";
					break;
				case 'b': 
					rally ++;
					if(serving) {
						score.bcount1++;
						serving = false;
					}
					else{
						score.bcount2++;
						serving = true;
					}
					comments += "backhand; ";
					break;
				case 's': 	
					rally ++;
					if(serving) {
						score.scount1++;
						serving = false;
					}
					else{
						score.scount2++;
						serving = true;
					}
					comments += "backhand slice; ";
					break;
				case 'r': 	
					rally ++;
					if(serving) {
						score.rcount1++;
						serving = false;
					}
					else{
						score.rcount2++;
						serving = true;
					}
					comments += "forehand slice; ";
					break;
				case 'v': 
					rally ++;
					if(serving) {
						score.vcount1++;
						serving = false;
					}
					else{
						score.vcount2++;
						serving = true;
					}
					comments += "forehand volley; ";
					break;
				case 'z': 
					rally ++;
					if(serving) {
						score.zcount1++;
						serving = false;
					}
					else{
						score.zcount2++;
						serving = true;
					}
					comments += "backhand volley; ";
					break;
				case 'l': 	
					rally ++;
					if(serving) {
						score.lcount1++;
						serving = false;
					}
					else{
						score.lcount2++;
						serving = true;
					}
					comments += "forehand lob; ";
					break;
				case 'm': 	
					rally ++;
					if(serving) {
						score.mcount1++;
						serving = false;
					}
					else{
						score.mcount2++;
						serving = true;
					}
					comments += "backhand lob; ";
					break;
				case 'o': 
					rally ++;
					if(serving) {
						score.ocount1++;
						serving = false;
					}
					else{
						score.ocount2++;
						serving = true;
					}
					comments += "standard overhead/smash; ";
					break;
				case 'p': 
					rally ++;
					if(serving) {
						score.pcount1++;
						serving = false;
					}
					else{
						score.pcount2++;
						serving = true;
					}
					comments += "backhand overhead/smash; ";
					break;
				case 'u': 
					rally ++;
					if(serving) {
						score.ucount1++;
						serving = false;
					}
					else{
						score.ucount2++;
						serving = true;
					}
					comments += "forehand drop shots; ";
					break;
				case 'y': 
					rally ++;
					if(serving) {
						score.ycount1++;
						serving = false;
					}
					else{
						score.ycount2++;
						serving = true;
					}
					comments += "backhand drop shots; ";
					break;
				case 'h': 
					rally ++;
					if(serving) {
						score.hcount1++;
						serving = false;
					}
					else{
						score.hcount2++;
						serving = true;
					}
					comments += "forehand half-volley; ";
					break;
				case 'i': 
					rally ++;
					if(serving) {
						score.icount1++;
						serving = false;
					}
					else{
						score.icount2++;
						serving = true;
					}
					comments += "backhand half-volley; ";
					break;
				case 'j': 
					rally ++;
					if(serving) {
						score.jcount1++;
						serving = false;
					}
					else{
						score.jcount2++;
						serving = true;
					}
					comments += "forehand swinging volley; ";
					break;
				case 'k': 
					rally ++;
					if(serving) {
						score.kcount1++;
						serving = false;
					}
					else{
						score.kcount2++;
						serving = true;
					}
					comments += "backhand swinging volley; ";
					break;
				case 't': 
					rally ++;
					if(serving) {
						score.tcount1++;
						serving = false;
					}
					else{
						score.tcount2++;
						serving = true;
					}
					comments += "trick shots; ";
					break;
				case 'n': faultReason = 1; break;
				case 'w': faultReason = 2; break;
				case 'd': faultReason = 3; break;
				case 'x': faultReason = 4; break;
				case '1':
				case '2':
				case '3':
				case '7':
				case '8':
				case '9': 
				case '+':
				case '-':
				case '=': break;
				case '*': comments += "winner;";error = 3; break;
				case '#': comments += "forced error;";error = 2; break;
				case '@': comments += "unforced error;";error = 1; break;
				default:  System.out.println("error code" + chs[i-1]);
			}
		}
		comments += rally+"-shot rally";
		score.firstServingFault = firstServingFault;
		score.doubleFaults = doubleFaults;
		score.ace = ace;
		score.faultReason = faultReason;
		score.error = error;		
		score.rally = rally;	
		score.serveDirection = serveDirection;
		score.comments = comments;
	}
	
	public void detectCriticalMoment() throws ServletException {
		int num = 0;
		try{
			BufferedReader br = new BufferedReader(new FileReader(getServletContext().getRealPath("/WEB-INF/m922.txt")));
			TennisScore score = null;
			for(int i = 0; i<matches.size();i++){
				for(int j=0; j<matches.get(i).sets.size();j++){
					for(int k=0; k<matches.get(i).sets.get(j).games.size();k++){
						score = null;
						for(int l=0;l<matches.get(i).sets.get(j).games.get(k).scores.size();l++){
							TennisGame game = matches.get(i).sets.get(j).games.get(k);
							if(matches.get(i).matchId == 922){
								num ++;
								System.out.println("num="+num);								
								String tmp = br.readLine().trim();
								System.out.println("["+tmp+"]");
								String offset [] = tmp.trim().split(":");
								game.scores.get(l).hoffset = offset[0];
								game.scores.get(l).moffset = offset[1];
								game.scores.get(l).soffset = offset[2];
							} 
							TennisScore cur_score = game.scores.get(l);
							if(l == 0){
								score = cur_score;
								continue;
							}
							int count1 = 0;
							int count2 = 0;
							for(int m = 0; m< k; m++){
								if(matches.get(i).sets.get(j).games.get(m).winner == 0){
									count1++;
								}
								else{
									count2++;
								}
							}
							int count3 = 0;
							int count4 = 0;
							for(int m = 0; m< j; m++){
								if(matches.get(i).sets.get(m).winner == 0){
									count3++;
								}
								else{
									count4++;
								}
							}
							int winningNum = matches.get(i).host > matches.get(i).guest ? matches.get(i).host : matches.get(i).guest;
						
							// break point detection
							if(((score.host == 40 && score.guest < 40) || (score.guest == 40 && score.host ==50))&&(game.serving==1)){
								cur_score.bpoints1 = 1;
							}
							else if(((score.guest == 40 && score.host < 40)||(score.guest == 50 && score.host == 40))&&(game.serving==0)){
								cur_score.bpoints2 = 1;
							}
							// game point detection 
							if((score.host == 40 && score.guest < 40) || (score.guest == 40 && score.host ==50)||(score.host == 6 && score.guest <6) || (score.host == 7 && score.guest == 6)){
								cur_score.gpoints1  = 1;
								// set point detection
								if((count1 == 5 && count2 <5) || (count1 == 6)){
									cur_score.spoints1 = 1;
									// match point detection
									if(count3 == winningNum - 1){
										cur_score.mpoints1 = 1;
									}
								}
							
							}
							else if((score.guest == 40 && score.host < 40) || (score.host == 40 && score.guest ==50)||(score.guest == 6 && score.host <6) || (score.guest == 7 && score.host == 6)){
								cur_score.gpoints2  = 1;
								// set point detection
								if((count2 == 5 && count1 <5) || (count2 == 6)){
									cur_score.spoints2 = 1;
									// match point detection
									if(count4 == winningNum - 1){
										cur_score.mpoints2 = 1;
									}
								}
							}
							score = cur_score ;
						}
					}
				}
			}
		}
		catch(Exception e){
			throw new ServletException(e);
		}	
	}
	
	private class CriticalMoment{
		int setNO;
		int gameNO;
		int scoreNO;
		int people;
		int seq;
	}
	
	public void genMatchReport(){
		int count = 0;
		for(int i = 0; i<matches.size();i++){
			for(int j=0; j<matches.get(i).sets.size();j++){
				count = 0;
				int tmpHost = 0;
				int tmpGuest = 0;
				int numOfShots = 0;
				for(int k=0; k<matches.get(i).sets.get(j).games.size();k++){
					TennisGame game = matches.get(i).sets.get(j).games.get(k); 
					if(game.winner == 0){
						tmpHost ++;
					}
					else{
						tmpGuest ++;
					}
					game.host1 = tmpHost;
					game.guest1 = tmpGuest;
					for(int l=0;l<matches.get(i).sets.get(j).games.get(k).scores.size();l++){
						numOfShots += matches.get(i).sets.get(j).games.get(k).scores.get(l).rally;
						if(l == 0) {
							game.startShot = numOfShots;
						}
						TennisMatch match = matches.get(i);
						TennisScore score = matches.get(i).sets.get(j).games.get(k).scores.get(l);
						if(l == 0) {
							score.winner = score.host > score.guest ? 0 : 1; 
						}
						else{
							TennisScore pre =  matches.get(i).sets.get(j).games.get(k).scores.get(l-1);
							score.winner = (score.host - score.guest > pre.host - pre.guest) ? 0 : 1;
						}
						String tmp = "";
						int people = 0;
						if(score.bpoints1 == 1 || score.bpoints2 == 1){
							tmp += (score.bpoints1 == 1) ? match.player1:match.player2;
							people = (score.bpoints1 == 1) ?0:1;
							if(l ==  matches.get(i).sets.get(j).games.get(k).scores.size() - 1){
								tmp += " take a break point. "; 
							}
							else{
								tmp += " miss a break point. "; 
							}
						}
						if(score.mpoints1 == 1 || score.mpoints2 == 1){
							tmp += (score.mpoints1 == 1) ? match.player1:match.player2;
							people = (score.mpoints1 == 1) ?0:1;
							if(l ==  matches.get(i).sets.get(j).games.get(k).scores.size() - 1){
								tmp += " take a match point. "; 
							}
							else{
								tmp += " miss a match point. "; 
							}
						}
						else if(score.spoints1 == 1 || score.spoints2 == 1){
							tmp += (score.spoints1 == 1) ? match.player1:match.player2;
							people = (score.spoints1 == 1) ?0:1;
							if(l ==  matches.get(i).sets.get(j).games.get(k).scores.size() - 1){
								tmp += " take a set point. "; 
							}
							else{
								tmp += " miss a set point. "; 
							}
						}
						else if(score.gpoints1 == 1 || score.gpoints2 == 1){
							tmp += (score.gpoints1 == 1) ? match.player1:match.player2;
							people = (score.gpoints1 == 1)? 0:1;
							if(l ==  matches.get(i).sets.get(j).games.get(k).scores.size() - 1){
								tmp += " take a game point. "; 
							}
							else{
								tmp += " miss a game point. "; 
							}
						}
						if(!tmp.equals("")){
							//tmp = "j="+j+" k="+k+" l="+l +" "+tmp;
							CriticalMoment cm = new CriticalMoment();
							cm.setNO = j;
							cm.gameNO = k;
							cm.scoreNO = l;
							cm.people = people;
							cm.seq = count;
							match.CMs.add(cm);
							match.matchReport.add(tmp);
						}
						count ++;
					}
					game.endShot = numOfShots;
					//numOfShots += 5;	
				}
			}
		}	
	}
	
	/*
	public static void main(String [] args){
		TennisReader instance = new TennisReader();
		instance.build();
		//System.out.println("size = " + instance.matches.size());
		String json = new Gson().toJson(instance.matches.get(0));
		//System.out.println(json);
	}
	*/
}