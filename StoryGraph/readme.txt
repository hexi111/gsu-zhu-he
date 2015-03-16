Instructions for setting up the StoryGraph Web application on a Tomcat Server

1. Install Tomcat on the server.

2. Copy the entire /StoryGraph to some place on the server.

3. The StoryGraph.xml file in /StoryGraph should be copied to tomcat_install_dir/conf/Catalina/localhost in order for tomcat to find and load the code in /StoryGraph. If some directories do not exist, create them. The docBase property should be changed to where the /StoryGraph is copied accordingly.

4. Start Tomcat.

5. Open a browser window, and navigate to http://localhost:8080/StoryGraph.


