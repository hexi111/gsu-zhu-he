package edu.gsu.tsvz;

import java.util.List;

public class Product {
	private String id;
	private ProductName name;
	private double price;
	private List <String> areas;
	
	public Product(String id, ProductName name, double price, List <String> areas){
		this.id=id;
		this.name=name;
		this.price=price;
		this.areas=areas;
	}
	
	public String getId(){
		return this.id;
	}
	
	public void setId(String id){
		this.id=id;
	}
	
	public ProductName getName(){
		return this.name;
	}
	
	public void setName(ProductName name){
		this.name=name;
	}
	
	public double getPrice(){
		return this.price;
	}
	
	public void setPrice(double price){
		this.price=price;
	}
	
	public List <String> getAreas(){
		return this.areas;
	}
	
	public void setAreas(List <String> areas){
		this.areas=areas;
	}
} 
