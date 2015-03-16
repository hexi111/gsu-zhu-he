/*

This class is designed to compute the number of line crossings in a bipartite graph.
The bipartite graph is constructed by reading the latitude and longitude from a report 
regarding the afghanistan war 2004-2009.
  
*/
package edu.gsu.storygraph;

import java.util.ArrayList;
import java.io.FileReader;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.File;
import java.util.Scanner;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;

public class BipartiteProcessor {
	
	private ArrayList <ALine> lines=new ArrayList<ALine>();
	private ArrayList <ANode> leftNodes=new ArrayList<ANode>();
	private ArrayList <ANode> rightNodes=new ArrayList<ANode>();
	
	public static void main(String [] args) {
		BipartiteProcessor bp=new BipartiteProcessor();

		bp.construction(".."+File.separator+"data"+File.separator+"test.csv",9,10);
		bp.createBiPartite();
		
		//bp.construction("afg.csv",3,4);
		//bp.printData();
		//bp.assignPosition0();
		//bp.compuateCrossingLines();

		//bp.countUnicPoints();
		
		//Collections.sort(bp.getLines(),bp.new LatitudeComparator());
		//bp.printData();
		//bp.assignPosition1();
		//bp.compuateCrossingLines();
		
		//Collections.sort(bp.getLines(),bp.new LongitudeComparator());
		//bp.printData();
		//bp.assignPosition2();
		//bp.compuateCrossingLines();
		bp.assignNodePos();
		bp.computeCrossingLines();
		//bp.printNodes();
		//Collections.sort(bp.getLeftNodes(),bp.new NodeComparator());
		Collections.sort(bp.getRightNodes(),bp.new NodeComparator());
		bp.assignNodePos();
		//bp.printNodes();
		bp.computeCrossingLines();
	}

	public ArrayList <ALine> getLines(){
		return lines;
	}
	
	public ArrayList <ANode> getLeftNodes(){
		return leftNodes;
	}
	
	public ArrayList <ANode> getRightNodes(){
		return rightNodes;
	}
	
	public void assignPosition0(){
		for(int i=0;i<lines.size();i++){
			lines.get(i).setOriPos(i);
		}
	}
	public void assignPosition1(){
		for(int i=0;i<lines.size();i++){
			lines.get(i).setLatPos(i);
		}
	}
	public void assignPosition2(){
		for(int i=0;i<lines.size();i++){
			lines.get(i).setLonPos(i);
		}
	}
	
	public void assignNodePos(){
		for(int i=0;i<leftNodes.size();i++){
			leftNodes.get(i).setPos(i);
		}
		for(int i=0;i<rightNodes.size();i++){
			rightNodes.get(i).setPos(i);
		}
	}
	
	public void printData(){
		for(ALine line:lines){
			//System.out.println(line.getLatitude()+" "+line.getLongitude());
		}
		System.out.println("total number is "+lines.size());
	}
	public void construction(String filename,int pos1, int pos2){
		try{
			BufferedReader fp=new BufferedReader(new FileReader(filename));
			String str=fp.readLine();
			double latitude=0.0;
			double longitude=0.0;
			while(str!=null){
				Scanner s =new Scanner(str);
				//System.out.println("str="+str);
				String theDate;
				boolean badRecord=false;
				s.useDelimiter(",");
				for (int i=0;i<pos1;i++){
					if(s.hasNext()){
						s.next();
					}
					else {
						badRecord=true;
						break;
					}	
				}
				if(badRecord){
					str=fp.readLine();
					continue;
				}
				if(s.hasNext()){
					try{
						latitude=s.nextDouble();
					}
					catch(Exception e){
						str=fp.readLine();
						continue;
					}
				}
				else{
					str=fp.readLine();
					continue;
				}
				for (int i=(pos1+1);i<pos2;i++){
					if(s.hasNext()){
						s.next();
					}
					else {
						badRecord=true;
						break;
					}	
				}
				if(badRecord){
					str=fp.readLine();
					continue;
				}
				if(s.hasNext()){
					try{
						longitude=s.nextDouble();
					}
					catch(Exception e){
						str=fp.readLine();
						continue;
					}
				}
				else{
					str=fp.readLine();
					continue;
				}
				str=fp.readLine();
				ALine oneLine=new ALine();
				oneLine.setlatitude(latitude);
				oneLine.setLongitude(longitude);
				lines.add(oneLine);
			}
		}
		catch(IOException e){
			e.printStackTrace();
			System.out.println("File not found!");
			System.exit(-1); 
		}
	}
	 
	private class ALine{
		
		private double latitude;
		private double longitude;
		private int latPos;
		private int lonPos;
		private int oriPos;
		
		public double getLatitude(){
			return this.latitude;
		}
		public void setlatitude(double latitude){
			this.latitude=latitude;
		}
		public double getLongitude(){
			return this.longitude;
		}
		public void setLongitude(double longitude){
			this.longitude=longitude;
		}
		public int getLatPos(){
			return this.latPos;
		}
		public void setLatPos(int latPos){
			this.latPos=latPos;
		}
		public int getLonPos(){
			return this.lonPos;
		}
		public void setLonPos(int lonPos){
			this.lonPos=lonPos;
		}
		public int getOriPos(){
			return this.oriPos;
		}
		public void setOriPos(int oriPos){
			this.oriPos=oriPos;
		}
	}
	
	private class ANode{
		private double value;
		private ArrayList<ALine> relatedLines=new ArrayList<ALine>();
		private ArrayList<ANode> nodes=new ArrayList<ANode>();
		private int pos;
		
		public double getValue(){
			return this.value;
		} 
		public void setValue(double value){
			this.value=value;
		}
		public ArrayList<ANode> getNodes(){
			return this.nodes;
		}
		public void addNodes(ANode n){
			this.nodes.add(n);
		}
		public ArrayList<ALine> getLines(){
			return this.relatedLines;
		}
		public void addLines(ALine l){
			this.relatedLines.add(l);
		}
		public void setPos(int pos){
			this.pos=pos;
		}
		public int getPos(){
			return this.pos;
		}
		public void printInf(){
			System.out.println("**********");
			for(ANode node:nodes){
				System.out.println(value+" --> "+node.getValue());
			}
			System.out.println("**********");
		}
	}
	
	private class LatitudeComparator implements Comparator <ALine>{
	    public int compare(ALine a, ALine b) {
        	return (int)(Math.signum(a.getLatitude()-b.getLatitude()));
    	}
	}
	
	private class LongitudeComparator implements Comparator <ALine>{
	    public int compare(ALine a, ALine b) {
        	return (int)(Math.signum(a.getLongitude()-b.getLongitude()));
    	}
	}

	private class NodeComparator implements Comparator <ANode>{
	    public int compare(ANode a, ANode b) {
        	return (int)(Math.signum(a.getValue()-b.getValue()));
    	}
	}
		
	public void computeCrossingLines(){
		/*
		int sum=0;
		for(int i=0;i<lines.size();i++){
			for(int j=0;j<lines.size();j++){
				if((lines.get(i).getLatitude()>lines.get(j).getLatitude())&&(lines.get(i).getLongitude()<lines.get(j).getLongitude())){
					sum++;
				}
				else if((lines.get(i).getLatitude()<lines.get(j).getLatitude())&&(lines.get(i).getLongitude()>lines.get(j).getLongitude())){
					sum++;
				}
			}
		}
		sum=sum>>2;
		System.out.println("sum="+sum);
		*/
		int sum=0;
		for(int i=0;i<leftNodes.size();i++){
			for(int j=(i+1);j<leftNodes.size();j++){
				ArrayList <ANode> nodes1=leftNodes.get(i).getNodes();
				ArrayList <ANode> nodes2=leftNodes.get(j).getNodes();
				for(int k=0;k<nodes1.size();k++){
					for(int l=0;l<nodes2.size();l++){
						if(nodes1.get(k).getPos()>nodes2.get(l).getPos()){
							//System.out.println("[ "+leftNodes.get(i).getValue()+" , "+nodes1.get(k).getValue()+" --> "+leftNodes.get(j).getValue()+" , "+nodes2.get(l).getValue());
							sum++;
						}		
					}
				}
			}
		}
		System.out.println("sum="+sum);
	}
	
	public void countUnicPoints(){
		HashMap <Double,ALine> tmp1=new HashMap<Double,ALine>();
		for(ALine l:lines){
			tmp1.put(new Double(l.getLatitude()),l);
		}
		System.out.println("uniq latitude number is "+tmp1.size());
		HashMap <Double,ALine> tmp2=new HashMap<Double,ALine>();
		for(ALine l:lines){
			tmp2.put(new Double(l.getLongitude()),l);
		}
		System.out.println("uniq longitude number is "+tmp2.size());
	}
	
	public void createBiPartite(){
		
		HashMap <Double,ANode> tmp1=new HashMap<Double,ANode>();
		for(ALine l:lines){
			Double d=new Double(l.getLatitude());
			if(tmp1.containsKey(d)){
				tmp1.get(d).addLines(l);
			}
			else{
				ANode node=new ANode();
				node.setValue(l.getLatitude());
				node.addLines(l);
				tmp1.put(d,node);
				leftNodes.add(node);
			}
		}

		HashMap <Double,ANode> tmp2=new HashMap<Double,ANode>();
		for(ALine l:lines){
			Double d=new Double(l.getLongitude());
			if(tmp2.containsKey(d)){
				tmp2.get(d).addLines(l);
			}
			else{
				ANode node=new ANode();
				node.setValue(l.getLongitude());
				node.addLines(l);
				tmp2.put(d,node);
				rightNodes.add(node);
			}
		}
		
		for(ANode node:leftNodes){
			HashSet<ANode> arc=new HashSet<ANode>();
			for(ALine line:node.getLines()){
				arc.add(tmp2.get(new Double(line.getLongitude())));
			}
			Iterator <ANode> iter=arc.iterator();
			while(iter.hasNext()){
				node.addNodes(iter.next());
			}
		}
		
		for(ANode node:rightNodes){
			HashSet<ANode> arc=new HashSet<ANode>();
			for(ALine line:node.getLines()){
				arc.add(tmp1.get(new Double(line.getLatitude())));
			}
			Iterator <ANode> iter=arc.iterator();
			while(iter.hasNext()){
				node.addNodes(iter.next());
			}
		}
		
	}
	
	public void printNodes(){
		for(ANode node:leftNodes){
			//if(node.getNodes().size()>1){
				node.printInf();
			//}
		}
		for(ANode node:rightNodes){
			//if(node.getNodes().size()>1){
				node.printInf();
			//}
		}
	}
}