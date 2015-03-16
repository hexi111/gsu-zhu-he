package edu.gsu.nlp.processing;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

public class SomeServlet extends HttpServlet{

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException{
		String text = "some text";
		System.out.println("Running to here");
		ArrayList <Product> products =new ArrayList <Product>();
		Product prod;
		List <String> area1=new ArrayList<String>();
		area1.add("beijing");
		area1.add("shanghai");
		area1.add("guangzhou");
		List <String> area2=new ArrayList<String>();
		area2.add("New York");
		area2.add("Atlanta");
		area2.add("Chicago");
		List <String> area3=new ArrayList<String>();
		area3.add("Wu Zhou");
		area3.add("nan ning");
		prod=new Product("001",new ProductName("apple","computer"),543.00, area1);
		products.add(prod);
		prod=new Product("002",new ProductName("Samsung","smartphone"),1000.00,area2);
		products.add(prod);
		prod=new Product("001",new ProductName("Microsoft","tablet"),600.00,area3);
		products.add(prod);
		String json = new Gson().toJson(products);
		
		response.setContentType("text/json");  // Set content type of the response so that jQuery knows what it can expect.
		response.setCharacterEncoding("UTF-8"); // You want world domination, huh?
		response.getWriter().write(json);       // Write response body.
	}

}
