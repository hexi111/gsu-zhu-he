Instructions for setting up the NLPVis Web application on a Tomcat Server

1. Install Tomcat on the server.

2. Copy the entire /NLPVis to some place on the server.

3. The NLPVis.xml file in /NLPVis should be copied to tomcat_install_dir/conf/Catalina/
localhost in order for tomcat to find and load the code in /NLPVis. If some directories do not exist, create them. The docBase property should be changed to where the /NLPVis is copied accordingly.

4. The setenv.sh and setenv.bat file in /NLPVis should be copied to tomcat_install_dir/bin. These files are used to specify the memory usage of the NLPVis Web application.

5. Start Tomcat.

6. Open a browser window, and navigate to http://localhost:8080/NLPVis.


