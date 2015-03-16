package edu.gsu.nlp.processing;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletContext;

import org.apache.commons.fileupload.*;
import org.apache.commons.fileupload.disk.*;
import org.apache.commons.fileupload.servlet.*;
import org.apache.commons.io.output.*;

import java.util.List;
import java.io.InputStream;
import java.io.File;
import java.io.IOException;
import java.io.FileOutputStream;

import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class UploadServlet extends HttpServlet{

	
	public void init() throws ServletException {
		
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException{
		
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException{
		
		try {
			
			// Create a factory for disk-based file items
			DiskFileItemFactory factory = new DiskFileItemFactory();

			// Configure a repository (to ensure a secure temp location is used)
			ServletContext servletContext = this.getServletConfig().getServletContext();
			File repository = (File) servletContext.getAttribute("javax.servlet.context.tempdir");
			factory.setRepository(repository);

			// Create a new file upload handler
			ServletFileUpload upload = new ServletFileUpload(factory);

			//List<FileItem> items = new ServletFileUpload(new DiskFileItemFactory()).parseRequest(request);
			List<FileItem> items = upload.parseRequest(request);

			String corpusName="";
			InputStream fileContent=null;
			for (FileItem item : items) {
				if (item.isFormField()) {
					//System.out.println("fieldname="+item.getFieldName());
					//System.out.println("value="+item.getString());
					//	Process regular form field (input type="text|radio|checkbox|etc", select, etc).
					//  Retrieve corpus name.
					//	String fieldName = item.getFieldName();
					if(item.getFieldName().equals("corpusName")){
						corpusName = item.getString();
					}
				} else {
					// Process form file field (input type="file").
					//String fieldName = item.getFieldName();
					//String fileName = FilenameUtils.getName(item.getName());
					//System.out.println("filename1="+item.getName());
					fileContent = item.getInputStream();
				}
			}
			readZipFile( fileContent, corpusName);
			//System.out.println("right here");
			response.setContentType("text/html");  
			response.setCharacterEncoding("UTF-8"); 
			response.getWriter().write("OK");
		} catch (FileUploadException e) {
			throw new ServletException("Cannot parse multipart request.", e);
		}
	}
	
	protected void readZipFile(InputStream fileContent, String corpusName) throws IOException {
			
		byte[] buffer = new byte[1024];
		String base=getServletContext().getRealPath("/WEB-INF/repository/"+corpusName);
		
		File dir=new File(base);
		if(dir.mkdir()){
			System.out.println("dir "+base+" is created.");
		}

		//get the zip file content
		ZipInputStream zis = new ZipInputStream(fileContent);
		//get the zipped file list entry
		ZipEntry ze = zis.getNextEntry();

		while(ze!=null){

			String fileName = ze.getName();
			fileName=fileName.substring(fileName.lastIndexOf(File.separator)+1);
			//System.out.println("file name "+fileName);
			File newFile = new File(base + File.separator + fileName);
			
			//System.out.println("suffix="+fileName.substring(fileName.lastIndexOf(".")+1));
			if(ze.isDirectory()){
			}
			else if(!fileName.substring(fileName.lastIndexOf(".")+1).equals("txt")){
			}
			else{		
				//System.out.println("here");	            
				FileOutputStream fos = new FileOutputStream(newFile);             
				int len;
				while ((len = zis.read(buffer)) > 0) {
					fos.write(buffer, 0, len);
				}
				fos.close(); 
			}
  
			ze = zis.getNextEntry();
		}

		zis.closeEntry();
		zis.close();
   }    	
}
