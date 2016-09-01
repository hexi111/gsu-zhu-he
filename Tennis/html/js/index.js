// global var
var tennisMatch;
var width_axe=70;
var height_axe=20;
var height_yaxe=35;
var colors=[];
var players=[];

//var address="http://match.sports.sina.com.cn/livecast/t/live.php?id=126790";
//var address="http://match.sports.sina.com.cn/livecast/t/live.php?id=126827";
//var address="http://match.sports.sina.com.cn/livecast/t/live.php?id=120477";
//var address="http://match.sports.sina.com.cn/livecast/t/live.php?id=126736";
//var address="http://match.sports.sina.com.cn/livecast/t/live.php?id=128685";
//var address="http://match.sports.sina.com.cn/livecast/t/live.php?id=128342";


//good
var address="http://match.sports.sina.com.cn/livecast/t/live.php?id=126827";
//var address="http://match.sports.sina.com.cn/livecast/t/live.php?id=126775";
//var address="http://match.sports.sina.com.cn/livecast/t/live.php?id=126756";
//var address="http://match.sports.sina.com.cn/livecast/t/live.php?id=128284";
//var address="http://match.sports.sina.com.cn/livecast/t/live.php?id=42646";

$(document).ready(function() {
 	
	computeHeight();
	
	$( "#submit" ).button({
		text: true
	})
	.click(function() {
		//svg_dissappear(0);
		//svg_dissappear(1);
		//svg_dissappear(2);
		//svg_show(2);
		console.log("here"+$("#question").val());
		$.post('/Tennis/ParseQueryServlet','queryString='+$("#question").val()+'&name1='+players[0]+'&name2='+players[1]+'&numOfSets='+numOfSvgs, function(queryResult) {
		//$.post('/Tennis/ParseQueryServlet','queryString=11&name1=22&name2=33&numOfSets=4', function(queryResult) {
			//console.log(queryResult);
			transform1(queryResult.status,queryResult.people,queryResult.character);
		});
	});
	
	$( "#filter" ).button({
		text: true
	})
	.click(function() {
		//svg_dissappear(0);
		//svg_dissappear(1);
		//svg_dissappear(2);
		//svg_show(2);
		//$.post('/Tennis/ParseQueryServlet','queryString='+$("#question").text()+'&name1='+players[0]+'&name2='+players[1]+'&numOfSets='+numOfSvgs, function(queryResult) {
		//$.post('/Tennis/ParseQueryServlet','queryString=11&name1=22&name2=33&numOfSets=4', function(queryResult) {
			//console.log(queryResult);
		//	transform(queryResult.status,queryResult.people,queryResult.character);
		//});
		//alert(document.getElementById("s1").checked);
		var svgStatusTmp = [];
		var svgPeopleTmp = [];
		var svgCharacterTmp = []; 
		for(i=0;i<numOfSvgs;i++){
			if(document.getElementById("s"+(i+1)).checked==true){
				svgStatusTmp[i]=1;
			}
			else{
				svgStatusTmp[i]=0;
			}
		}
		if(document.getElementById("p1").checked==true){
			svgPeopleTmp[0]=1;
		}
		else{
			svgPeopleTmp[0]=0;
		}

		if(document.getElementById("p2").checked==true){
			svgPeopleTmp[1]=1;
		}
		else{
			svgPeopleTmp[1]=0;
		}
		if(document.getElementById("ACE").checked==true){
			svgCharacterTmp[1]=1;
		}
		else{
			svgCharacterTmp[1]=0;
		}		
		if(document.getElementById("DF").checked==true){
			svgCharacterTmp[2]=1;
		}
		else{
			svgCharacterTmp[2]=0;
		}
		if(document.getElementById("BH").checked==true){
			svgCharacterTmp[3]=1;
		}
		else{
			svgCharacterTmp[3]=0;
		}
		if(document.getElementById("FH").checked==true){
			svgCharacterTmp[4]=1;
		}
		else{
			svgCharacterTmp[4]=0;
		}
		if(document.getElementById("V").checked==true){
			svgCharacterTmp[5]=1;
		}
		else{
			svgCharacterTmp[5]=0;
		}
		if(document.getElementById("IO").checked==true){
			svgCharacterTmp[6]=1;
		}
		else{
			svgCharacterTmp[6]=0;
		}
		if(document.getElementById("ALL").checked==true){
			svgCharacterTmp[0]=1;
		}
		else{
			svgCharacterTmp[0]=0;
		}
		transform(svgStatusTmp,svgPeopleTmp,svgCharacterTmp);
	});
	
	$( "#open" ).button({
		text: true
	})
	.click(function() {
	  	dialog1.dialog("open");
	});
	
	dialog1 = $( "#append_dialog" ).dialog({
		autoOpen: false,
		height: 200,
		width: 500,
		modal: true,
		buttons: {
			Visualize: load,
			Cancel: function() {
				dialog1.dialog( "close" );
			}
		},
		close: function() {
			form[ 0 ].reset();
			//allFields.removeClass( "ui-state-error" );
		}
	});
	
	form = dialog1.find( "form" ).on( "submit", function( event ) {
		event.preventDefault();
		load();
	});
	
	progressbar = $( "#progressbar" ),
	progressLabel = $( ".progress-label" );

	progressbar.progressbar({
		value: false,
		create: function(){
		},
		change: function() {
			//progressLabel.text( progressbar.progressbar( "value" ) + "%" );
		},
		complete: function() {
			progressLabel.text( "Complete!" );
			progressbar.hide();
		}
	});
	
	colors[0]="blue";
	colors[1]="red";
	
	dataLoading();
	//alert(players[0]);
});

function filter(){
	
}

function load(){
	address=($("#url").val());
	dataLoading();
	dialog1.dialog( "close" );
}

function dataLoading(){
	
	/*
	$.getJSON("data.json",function(data){
		//console.log(data);
		//console.log(data.match.host);
		tennisMatch=data;
		drawMatch();
	})
	*/
	
	progressbar.progressbar({
		value: false,
		create: function(){
		},
		change: function() {
			//progressLabel.text( progressbar.progressbar( "value" ) + "%" );
		},
		complete: function() {
			progressLabel.text( "Complete!" );
			progressbar.hide();
		}
	});
	
	$( ".progress-label" ).text("Loading...");	
	$( "#progressbar").show();
	
	$.post('/Tennis/ReadTennisLogServlet','address='+address, function(responseText) {
		tennisMatch=responseText;
		$( "#progressbar" ).progressbar( "value", 100 );
		players[0]=tennisMatch.player1;
		players[1]=tennisMatch.player2;
		//drawMatch();
		initData();
		$( "#ppl1" ).text(players[0].split(" ")[0]);
		$( "#ppl2" ).text(players[1].split(" ")[0]);
		for(i=numOfSvgs+1;i<=5;i++){
			$( "#set"+i ).hide();
			$( "#s"+i ).hide();
		}
		//alert(numOfSvgs);
	});
}

function computeHeight(){
	var windowHeight=$(window).height()-20;
	//console.log("windowHeight="+windowHeight);
	$("#title").height(20);
	$("#content").height(windowHeight-40);
	$("#keyword").height(windowHeight-40);
	$("#input").height(40);
	var pagesWidth=$("#content").width();
	var leftString=(pagesWidth-400)/2+"px";
	var pagesHeight=$("#content").height();
	var topString=(pagesHeight-40)/2+"px";
	$("#progressbar").css({left:leftString});;
	$("#progressbar").css({top:topString});;
}

function addLegend(){

	var div_height=$("#keyword").height()-14;
	var div_width=$("#keyword").width();
	var svg=d3.select("#legend").append("svg")	
		.attr("width", "100%")
		.attr("height", "100%");
	var width=3;
	var height=10;
	// add legend   
	var legend = svg.append("g")
		.attr("class", "legend")
		.attr("height", "100%")
		.attr("width", "100%")
		.attr('transform', 'translate('+width+','+height+')');   
      
    
    legend.selectAll('rect')
	.data(colors)
	.enter()
	.append("rect")
	.attr("x", 5)
	.attr("y", function(d, i){ return i *  20;})
	.attr("width", 10)
	.attr("height", 10)
	.style("fill", function(d) { 
    	return d;
	});
      
    legend.selectAll('text')
	.data(players)
	.enter()
	.append("text")
	.attr("x", 20)
	.attr("y", function(d, i){ return i *  20 + 9;})
	.text(function(d) {
		return d;
	});
}

function addTitle(){
	var div_height=$("#title").height();
	var div_width=$("#title").width();
	var svg=d3.select("#title").append("svg")	
	.attr("width", "100%")
	.attr("height", "100%");
	
	var legend = svg.append("g")
	.attr("class", "legend")
	.attr("height", "100%")
	.attr("width", "100%")
	.attr('transform', 'translate('+(div_width/2-60)+','+0+')')  
	 
	legend.append("rect")
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", 20)
	.attr("height", 20)
	.style("fill", function(d) { 
    	return "blue";
	});
	
	legend.append("text")
	.attr("x", 25)
	.attr("y", 15)
	.attr("id","player1")
	.style("font-size","15px")
	.text(players[0]);
	
	var tmp=d3.select("#player1").node().getComputedTextLength();
	//alert("tmp="+tmp);
	
	legend.append("rect")
	.attr("x", 35+tmp)
	.attr("y", 0)
	.attr("width", 20)
	.attr("height", 20)
	.style("fill", function(d) { 
    	return "red";
	});
	
	tmp=tmp+35+20+5;
	
	legend.append("text")
	.attr("x", tmp)
	.attr("y", 15)
	.style("font-size","15px")
	.text(players[1]);
}