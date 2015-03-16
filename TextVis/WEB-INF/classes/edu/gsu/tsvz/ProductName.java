package edu.gsu.tsvz;

public class ProductName {

	private String firstName;
	private String lastName;
	
	public ProductName(String firstName, String lastName){
		this.firstName=firstName;
		this.lastName=lastName;
	}
	
	public String getFirstName(){
		return this.firstName;
	}
	
	public void setFirstName(String firstName){
		this.firstName=firstName;
	}
	
	public String getLastName(){
		return this.lastName;
	}
	
	public void setLastName(String lastName){
		this.lastName=lastName;
	}
	
} 
