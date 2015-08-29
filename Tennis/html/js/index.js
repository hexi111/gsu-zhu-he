// global var
var tennisMatch;
var duration = 100;
var width_axe=70;
var height_axe=20;
var height_yaxe=35;
var colors=[];
var players=[];

//var address="http://match.sports.sina.com.cn/livecast/t/live.php?id=126790";
var address="http://match.sports.sina.com.cn/livecast/t/live.php?id=126827";

$(document).ready(function() {
 	
	computeHeight();
	
	$( "#submit" ).button({
		text: true
	})
	.click(function() {
		svg_dissappear(0);
		svg_dissappear(1);
		svg_dissappear(2);
		svg_show(1);
		//svg_changeSize(0,2);

		//svgs[0].attr("height", 400).transition().delay(100).duration(1000000);
		//svgs[1].style("opacity",0).transition().delay(100).duration(100000);
		//svgs[2].style("opacity",0).transition().delay(100).duration(100000);
		//svgs[3].style("opacity",0).transition().delay(100).duration(100000);
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
	//alert("here");
});

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
		drawMatch();
	});
}

function computeHeight(){
	var windowHeight=$(window).height()-20;
	//console.log("windowHeight="+windowHeight);
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
	var svg=d3.select("#keyword").append("svg")	
		.attr("width", div_width)
		.attr("height", div_height);
	var width=10;
	var height=10;
	// add legend   
	var legend = svg.append("g")
		.attr("class", "legend")
		.attr("height", 10)
		.attr("width", 10)
		.attr('transform', 'translate('+width+','+height+')')    
      
    
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
	})
      
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