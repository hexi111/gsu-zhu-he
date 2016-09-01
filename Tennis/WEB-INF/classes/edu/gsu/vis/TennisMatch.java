package edu.gsu.vis;

import java.util.ArrayList;
import com.google.gson.Gson;

public class TennisMatch {
	
	private transient TennisSet currentSet;
	private transient TennisGame currentGame;
	private transient TennisScore currentScore;
	
	private int host;
	private int guest;
	private ArrayList <TennisSet> sets=new ArrayList <TennisSet>();
	
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
	
	public synchronized String toString(){
		String json = new Gson().toJson(this);
		return json;
	}
	
	public synchronized void update(int [][] tmp){
		if((tmp[6][0] == currentScore.getHost())&&(tmp[6][1] == currentScore.getGuest())){
			return;
		}
		//else if(tmp[this.host][])
		else if(((tmp[6][0] == 0)&&(tmp[6][1] == 15))||((tmp[6][0] == 15)&&(tmp[6][1] == 0))){
			if((tmp[this.host+this.guest-1][0]==7)||(tmp[this.host+this.guest-1][1]==7)||((tmp[this.host+this.guest-1][0]==6)&&((tmp[this.host+this.guest-1][1]<5)))||((tmp[this.host+this.guest-1][1]==6)&&((tmp[this.host+this.guest-1][0]<5)))){
				currentSet = new TennisSet();
				currentGame = new TennisGame();
				currentScore = new TennisScore();
				currentScore.host = tmp[6][0];
				currentScore.guest = tmp[6][1];
				this.addSets(currentSet);
				currentSet.addGames(currentGame);
				currentGame.addScores(currentScore);
			}
			else{
				currentGame = new TennisGame();
				currentScore = new TennisScore();
				currentScore.host = tmp[6][0];
				currentScore.guest = tmp[6][1];
				currentSet.addGames(currentGame);
				currentGame.addScores(currentScore);
			}
			if(tmp[6][0] == 15){
				currentGame.host = 1;
			}
			else{
				currentGame.guest = 1;
			}
		}
		else if((tmp[6][0] == 0)&&(tmp[6][1] == 0)){
			TennisScore lastScore = new TennisScore();
			if((currentScore.host == 40) && (currentScore.guest == 50)){
				lastScore.host = 40;
				lastScore.guest = 60;
				currentGame.guest ++;	
				currentGame.winner = 0;
			}
			else if((currentScore.host == 50) && (currentScore.guest == 40)){
				lastScore.host = 60;
				lastScore.guest = 40;
				currentGame.host ++;
				currentGame.winner = 1;	
			}
			else if(currentScore.host == 40) {
				lastScore.host = 50;
				lastScore.guest = currentScore.guest;
				currentGame.host ++;
				currentGame.winner = 1;

			}
			else if(currentScore.guest == 40) {
				lastScore.host = currentScore.host;
				lastScore.guest = 50;
				currentGame.guest ++;
				currentGame.winner = 0;
			}
			currentGame.addScores(lastScore);
			currentScore = new  TennisScore(0, 0);		
			currentSet.host = tmp[this.host+this.guest+1][0];
			currentSet.guest = tmp[this.host+this.guest+1][1];
		}
		else{
			currentScore =new TennisScore(tmp[6][0],tmp[6][1]);
			currentGame.addScores(currentScore);
			if(tmp[6][0] > tmp[6][1]){
				currentGame.host ++;
			}
			else{
				currentGame.guest ++;
			}
		}
		this.host = tmp[0][0];
		this.guest = tmp[0][1];
	}
	
	public void create(int [][] tmp){

		this.host = tmp[0][0];
		this.guest = tmp[0][1];
		for(int i = 0; i < (tmp[0][0]+tmp[0][1]);i++){
			currentSet = new TennisSet();
			this.addSets(currentSet);
			int host = tmp[i+1][0];
			int guest = tmp[i+1][1];
			currentSet.host = host;
			currentSet.guest = guest;
			for(int j = 0; j< host; j++){
				currentGame = new TennisGame(true);
				currentSet.addGames(currentGame);
			}
			for(int j = 0; j< guest; j++){
				currentGame = new TennisGame(false);
				currentSet.addGames(currentGame);
			}
		}
		// the match is over.
		if(tmp[0][0] + tmp[0][1] == 5) {
			return;
		}

		currentSet = new TennisSet();		
		currentSet.host = tmp[tmp[0][0] + tmp[0][1]+1][0];
		currentSet.guest = tmp[tmp[0][0] + tmp[0][1]+1][1];
		if((tmp[tmp[0][0] + tmp[0][1] + 1][0] != 0) || (tmp[tmp[0][0] + tmp[0][1] + 1][1] != 0)){
			for(int i = 0; i <tmp[tmp[0][0] + tmp[0][1]+1][0]; i++){
				currentGame  = new TennisGame(true);
				currentSet.addGames(currentGame);
			}
			for(int i = 0; i <tmp[tmp[0][0] + tmp[0][1]+1][1]; i++){
				currentGame = new TennisGame(false);
				currentSet.addGames(currentGame);
			}
		}

		currentGame = new TennisGame();		
		currentScore = new TennisScore();
		if((tmp[6][0] != 0) || (tmp[6][1] != 0)){
			currentGame.winner = 2;
			currentScore = new TennisScore();
			currentScore.host = tmp[6][0];
			currentScore.guest = tmp[6][1];
			currentGame.addScores(currentScore);
			currentSet.addGames(currentGame);
		}
		if(currentSet.getGames().size() > 0){
			this.addSets(currentSet);
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
		private ArrayList <TennisScore> scores=new ArrayList <TennisScore>();				
		private int winner = 2;	
		private int host;
		private int guest;			 
		public TennisGame(){
			
		}
		
		public TennisGame(boolean win){
			winner = win ? 1: 0;
			for(int i = 1; i <= 6; i++){
				TennisScore score = new TennisScore();
				score.host = 0;
				score.guest = 0;
				scores.add(score);
			}
		}
		
		public ArrayList <TennisScore> getScores(){
			return this.scores;
		}
		public void addScores(TennisScore score){
			this.scores.add(score);
		}
		
	}
	
	private class TennisScore {
		
		int host;
		int guest;
		
		public TennisScore(){
		
		}
		
		public TennisScore(int host, int guest){
			this.host = host;
			this.guest = guest;
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