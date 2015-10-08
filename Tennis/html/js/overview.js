var y ;
var format = d3.time.format("%b %e, %Y %I:%M:%S %p");
var xtime;
var svgs=[];
var numOfSvgs;
var dataSet=[];

var svgStatus=[];
var svgPeople=[];
var svgCharacter;


function svg_dissappear(index){
	svgs[index].selectAll("rect").transition().attr("height",0).attr("y",0).duration(500);
	svgs[index].selectAll("circle").transition().attr("cy",0).attr("r",0).delay(500).duration(500);
	svgs[index].selectAll("line").transition().attr("y1",0).attr("y2",0).attr("x1",0).attr("x2",0).delay(1000).duration(500);
	svgs[index].selectAll(".yaxis").transition().style("display","none").delay(1500).duration(500);
	svgs[index].selectAll(".xaxis").transition().style("display","none").delay(1500).duration(500);
	svgs[index].transition().style("visibility","false").delay(1500).duration(500);
}

function svg_show(index){
	svgs[index].transition().style("visibility","true").duration(500);
	svgs[index].selectAll(".yaxis").transition().style("display","block").delay(500).duration(500);
	svgs[index].selectAll(".xaxis").transition().style("display","block").delay(500).duration(500);
	
	var rects = svgs[index].selectAll("rect").data(dataSet[index].rect);	
	rects.transition().delay(1000).duration(500)
	.attr("x", function(d, j) { return d.x; })
	.attr("y", function(d, j) { return d.y; })
	.attr("fill",function(d, j) { return d.fill; })
	.attr("width", function(d, j) { return d.width; })
	.attr("height", function(d, j) { return d.height; });
	
	var lines1 = svgs[index].selectAll("line.host").data(dataSet[index].player1.lines);	
	lines1.transition().delay(1500).duration(500)
	.style("stroke", "blue") 
	.attr("class","host")
	.attr("x1", function(d, j) { return d.x1; })    
	.attr("y1", function(d, j) { return d.y1; })        
	.attr("x2", function(d, j) { return d.x2; })       
	.attr("y2", function(d, j) { return d.y2; });	
	
	var lines2 = svgs[index].selectAll("line.guest").data(dataSet[index].player2.lines);	
	lines2.transition().delay(1500).duration(500)
	.style("stroke", "red") 
	.attr("class","guest")
	.attr("x1", function(d, j) { return d.x1; })    
	.attr("y1", function(d, j) { return d.y1; })        
	.attr("x2", function(d, j) { return d.x2; })       
	.attr("y2", function(d, j) { return d.y2; });
	
	var points1=svgs[index].selectAll("circle.host").data(dataSet[index].player1.points);	
	points1.transition().delay(2000).duration(500)
	.attr("class","host")
	.attr("cx", function(d, j) { return d.cx; })    
	.attr("cy", function(d, j) { return d.cy; }) 
	.attr("r",3)
	.style("stroke", "blue");	

	var points2=svgs[index].selectAll("circle.guest").data(dataSet[index].player2.points);	
	points2.transition().delay(2000).duration(500)
	.attr("class","guest")
	.attr("cx", function(d, j) { return d.cx; })    
	.attr("cy", function(d, j) { return d.cy; }) 
	.attr("r",3)
	.style("stroke", "red");
}

function svg_update(index){
	svgs[index].selectAll("circle").transition().attr("cy",0).attr("r",0).delay(0).duration(500);
	var points1=svgs[index].selectAll("circle.host").data(dataSet[index].player1.points);	
	//alert("svgCharacter="+svgCharacter);
	points1.transition().delay(2000).duration(500)
	.attr("class","host")
	.attr("cx", function(d, j) { return d.cx; })    
	.attr("cy", function(d, j) { return d.cy; }) 
	.attr("r",function(d,j){
		if(svgCharacter==0){
			return d.ace*3;
		}
		else if(svgCharacter==1){
			return d.doubleFault*3;
		}
		else if(svgCharacter==2){
			return d.volley*3;
		}
	})
	.style("stroke", "blue");	

	var points2=svgs[index].selectAll("circle.guest").data(dataSet[index].player2.points);	
	points2.transition().delay(2000).duration(500)
	.attr("class","guest")
	.attr("cx", function(d, j) { return d.cx; })    
	.attr("cy", function(d, j) { return d.cy; }) 
	.attr("r",function(d,j){
		if(svgCharacter==0){
			return d.ace*3;
		}
		else if(svgCharacter==1){
			return d.doubleFault*3;
		}
		else if(svgCharacter==2){
			return d.volley*3;
		}
	})
	.style("stroke", "red");	
}

function svg_changeSize(index,num) {
	var div_height=$("#content").height()-14;
	var div_width=$("#content").width();	
		svgs[index].transition().delay(2000).duration(1000)
		.attr("width", div_width)
		.attr("height", div_height/num).style("border","0px solid black");;
}

function transform(status,people,character){
	var i;
	svgPeople=people;
	svgCharacter=character;
	for(i=0;i<numOfSvgs;i++){
		if((svgStatus[i]==1)&&(status[i]==0)){
			svg_dissappear(i);
		}
		else if ((svgStatus[i]==0)&&(status[i]==1)){
			svg_show(i);
		}
		else if ((svgStatus[i]==1)&&(status[i]==1)) {
			svg_update(i);
		}
	}
	svgStatus=status;
}

function initData(){
	
	var div_height=$("#content").height()-14-20;
	var div_width=$("#content").width();
	$("svg").remove();
	svgs=[];

	var numOfSets=tennisMatch.host+tennisMatch.guest;
	numOfSvgs = numOfSets;
	
	var i,j,k;
	var prex,prey1,prey2;
	var x,y1,y2;

	//alert(tennisMatch.sets[0].games[0].start);
	$("#time").text(tennisMatch.sets[0].games[0].start);
	for(i=0;i<numOfSvgs;i++){
		dataSet[i]=new Object();
		dataSet[i].rect=[];
		dataSet[i].player1=new Object();
		dataSet[i].player2=new Object();
		dataSet[i].player1.points=[];
		dataSet[i].player1.lines=[];
		dataSet[i].player2.points=[];
		dataSet[i].player2.lines=[];
	}
	for(i=0;i<numOfSets;i++){
		var svg = d3.select("#content").append("svg")
		.attr("width", div_width)
		.attr("height", div_height/numOfSets).style("border","0px solid black");
		svgs.push(svg);
		var numOfGames=tennisMatch.sets[i].host+tennisMatch.sets[i].guest;
		var numOfScores=0;
		for(j=0;j<numOfGames;j++){
			numOfScores=numOfScores+tennisMatch.sets[i].games[j].scores.length;
		}
		drawAxis(svg,div_width,div_height/numOfSets,numOfScores,i,tennisMatch);
		var numOfGames=tennisMatch.sets[i].host+tennisMatch.sets[i].guest;
		var numOfPoints=0;
		var numOfLines=0;
		var posY=y(60)+height_axe-1;
		for(j=0;j<numOfGames;j++){
			var posX=xtime(format.parse(tennisMatch.sets[i].games[j].start))+width_axe;
			var width=xtime(format.parse(tennisMatch.sets[i].games[j].end))+width_axe;
			dataSet[i].rect[j]=new Object();
			dataSet[i].rect[j].x=posX;
			dataSet[i].rect[j].y=posY;
			dataSet[i].rect[j].width=(width-posX);
			dataSet[i].rect[j].height=(div_height/numOfSets-height_yaxe-height_axe);
			if(tennisMatch.sets[i].games[j].winner==0){
				dataSet[i].rect[j].fill="#E6E6FF";
			}
			else{
				dataSet[i].rect[j].fill="#FFEBF5";
			}
			for(k=0;k<tennisMatch.sets[i].games[j].scores.length;k++){	
				x=xtime(format.parse(tennisMatch.sets[i].games[j].scores[k].timestamp))+width_axe;
				y1=y(tennisMatch.sets[i].games[j].scores[k].host)+height_axe;
				y2=y(tennisMatch.sets[i].games[j].scores[k].guest)+height_axe;
				//console.log("y1="+y(tennisMatch.sets[i].games[j].scores[k].host));
				//console.log("y2="+y(tennisMatch.sets[i].games[j].scores[k].guest));
				console.log("i="+i+" j="+j+" k="+k);
				console.log("x="+x);
				dataSet[i].player1.points[numOfPoints]= new Object();
				dataSet[i].player1.points[numOfPoints].cx=x;
				//console.log("cy1="+y1);
				dataSet[i].player1.points[numOfPoints].cy=y1;
				dataSet[i].player1.points[numOfPoints].comments=tennisMatch.sets[i].games[j].scores[k].comments;
				if(tennisMatch.sets[i].games[j].scores[k].ace==0){
					dataSet[i].player1.points[numOfPoints].ace=1;				
				}
				else{
					dataSet[i].player1.points[numOfPoints].ace=0;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].volley==0){
					dataSet[i].player1.points[numOfPoints].volley=1;				
				}
				else{
					dataSet[i].player1.points[numOfPoints].volley=0;				
				}
				dataSet[i].player2.points[numOfPoints]= new Object();
				dataSet[i].player2.points[numOfPoints].cx=x;
				dataSet[i].player2.points[numOfPoints].cy=y2;		
				dataSet[i].player2.points[numOfPoints].comments=tennisMatch.sets[i].games[j].scores[k].comments;
				if(tennisMatch.sets[i].games[j].scores[k].ace==1){
					dataSet[i].player2.points[numOfPoints].ace=1;				
				}
				else{
					dataSet[i].player2.points[numOfPoints].ace=0;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].volley==1){
					dataSet[i].player2.points[numOfPoints].volley=1;				
				}
				else{
					dataSet[i].player2.points[numOfPoints].volley=0;				
				}
				//console.log("cy2="+y2);
				numOfPoints++;
				if(k!=0){
					dataSet[i].player1.lines[numOfLines]=new Object();
					dataSet[i].player1.lines[numOfLines].x1=prex
					dataSet[i].player1.lines[numOfLines].y1=prey1;
					dataSet[i].player1.lines[numOfLines].x2=x;
					dataSet[i].player1.lines[numOfLines].y2=y1;	

					dataSet[i].player2.lines[numOfLines]=new Object();							
					dataSet[i].player2.lines[numOfLines].x1=prex
					dataSet[i].player2.lines[numOfLines].y1=prey2;
					dataSet[i].player2.lines[numOfLines].x2=x;
					dataSet[i].player2.lines[numOfLines].y2=y2;	
					numOfLines++;	
				}
				prex=x;
				prey1=y1;
				prey2=y2;
			}	
			dataSet[i].numOfLines=numOfLines;	
			dataSet[i].numOfPoints=numOfPoints;	
		}
	}
	console.log(dataSet);
	paint();
	for(i=0;i<numOfSets;i++){
		svgStatus[i]=1;
	}
	for(i=0;i<2;i++){
		svgPeople[i]=1;
	}
	svgCharacter=100;
	//addLegend();
	addTitle();
}


function paint(){

	var i;
	for(i=0;i<numOfSvgs;i++){
		var rects = svgs[i].selectAll("rect").data(dataSet[i].rect);	
		rects.enter().append("rect")
		.attr("x", function(d, j) { return d.x; })
		.attr("y", function(d, j) { return d.y; })
		.attr("fill",function(d, j) { return d.fill; })
		.attr("width", function(d, j) { return 0})
		.attr("height", function(d, j) { return 0});
		
		rects.transition().duration(1000)
		.attr("width", function(d, j) { return d.width; })
		.attr("height", function(d, j) { return d.height; });

		
		var lines1 = svgs[i].selectAll("line.host").data(dataSet[i].player1.lines);	
		lines1.enter().append("line")
		.style("stroke", "blue") 
		.attr("class","host")
		.attr("x1", function(d, j) { return d.x1; })    
		.attr("y1", function(d, j) { return 0; })        
		.attr("x2", function(d, j) { return d.x2; })       
		.attr("y2", function(d, j) { return 0; });
		
		lines1.transition().delay(1000).duration(1000)
  		.attr("y1", function(d, j) { return d.y1; })        
		.attr("y2", function(d, j) { return d.y2; });


		var lines2 = svgs[i].selectAll("line.guest").data(dataSet[i].player2.lines);	
		lines2.enter().append("line")
		.style("stroke", "red") 
		.attr("class","guest")
		.attr("x1", function(d, j) { return d.x1; })    
		.attr("y1", function(d, j) { return 0; })        
		.attr("x2", function(d, j) { return d.x2; })       
		.attr("y2", function(d, j) { return 0; }); 

		lines2.transition().delay(1000).duration(1000)
  		.attr("y1", function(d, j) { return d.y1; })        
		.attr("y2", function(d, j) { return d.y2; });
		
		var points1=svgs[i].selectAll("circle.host").data(dataSet[i].player1.points);	
		points1.enter().append("circle")
		.attr("class","host")
		.attr("cx", function(d, j) { return d.cx; })    
		.attr("cy", function(d, j) { return y(60); })    
		.attr("r",0)
		.style("stroke", "blue")
		.append("svg:title")
	    .text(function(d) { return d.comments; });	

		points1.transition().delay(2000).duration(1000)
		.attr("cx", function(d, j) { return d.cx; })    
		.attr("cy", function(d, j) { return d.cy; }) 
		.attr("r",3);	

		var points2=svgs[i].selectAll("circle.guest").data(dataSet[i].player2.points);	
		points2.enter().append("circle")
		.attr("class","guest")
		.attr("cx", function(d, j) { return d.cx; })    
		.attr("cy", function(d, j) { return y(60); })    
		.attr("r",0)
		.style("stroke", "red")
		.append("svg:title")
	    .text(function(d) { return d.comments; });
		
		points2.transition().delay(2000).duration(1000)
		.attr("cx", function(d, j) { return d.cx; })    
		.attr("cy", function(d, j) { return d.cy; }) 
		.attr("r",3);

	}
}

function drawMatch(){
	//initData();
	var div_height=$("#content").height()-14;
	var div_width=$("#content").width();
	$("svg").remove();
	var numOfSets=tennisMatch.host+tennisMatch.guest;
	numOfSvgs = numOfSets;
	var i;
	var j;
	var k;
	var delayTime=0;
	for(i=0;i<numOfSets;i++){
		var svg = d3.select("#content").append("svg")
		.attr("width", div_width)
		.attr("height", div_height/numOfSets).style("border","0px solid black");
		svgs.push(svg);
		var numOfGames=tennisMatch.sets[i].host+tennisMatch.sets[i].guest;
		var numOfScores=0;
		for(j=0;j<numOfGames;j++){
			numOfScores=numOfScores+tennisMatch.sets[i].games[j].scores.length;
		}
		drawAxis(svg,div_width,div_height/numOfSets,numOfScores,i,tennisMatch);
		var sequence=1;
		var x,y1,y2;
		var prex,prey1,prey2;
		var posY=y(60)+height_axe-1;
		for(j=0;j<numOfGames;j++){
			var posX=xtime(format.parse(tennisMatch.sets[i].games[j].start))+width_axe;
			var width=xtime(format.parse(tennisMatch.sets[i].games[j].end))+width_axe;
			var color;
			if(tennisMatch.sets[i].games[j].winner==0){
				color="#E6E6FF";
			}
			else{
				color="#FFEBF5";
			}
			svg.append("rect")
				.attr("x", posX)
				.attr("y", posY)
				.attr("fill",color)
				.attr("width", width-posX)
				.attr("height", (div_height/numOfSets-height_yaxe-height_axe));
			
			for(k=0;k<tennisMatch.sets[i].games[j].scores.length;k++){		
					x=xtime(format.parse(tennisMatch.sets[i].games[j].scores[k].timestamp))+width_axe;
					y1=y(tennisMatch.sets[i].games[j].scores[k].host)+height_axe;
					y2=y(tennisMatch.sets[i].games[j].scores[k].guest)+height_axe;
					var tmp1=svg.append("circle")
						.attr("cx", x)
						.attr("cy", y(60))
						.attr("r",2)
						.style("stroke", "blue");
						
					
					tmp1.attr("cy",y1).transition().duration(duration).delay(delayTime);	
							
					var tmp2=svg.append("circle")
						.attr("cx", x)
						.attr("cy", y(60))
						.attr("r",2)
						.style("stroke", "red");	

					tmp2.attr("cy",y2).attr("r",2).transition().duration(duration).delay(delayTime);	
					
					delayTime = delayTime+duration;
					
					sequence++;	
					if(k!=0){
						var tmp3=svg.append("line")          // attach a line
							.style("stroke", "blue")  // colour the line
							.attr("x1", prex)     // x position of the first end of the line
							.attr("y1", prey1)      // y position of the first end of the line
							.attr("x2", prex)     // x position of the second end of the line
							.attr("y2", prey1);   // y position of the second end of the line
							
						
						tmp3.attr("x2", x).attr("y2",y1).transition().duration(duration).delay(delayTime);	
						
						var tmp4=svg.append("line")          // attach a line
							.style("stroke", "red")  // colour the line
							.attr("x1", prex)     // x position of the first end of the line
							.attr("y1", prey2)      // y position of the first end of the line
							.attr("x2", prex)     // x position of the second end of the line
							.attr("y2", prey2);  // y position of the second end of the line
							
						tmp4.attr("x2", x).attr("y2",y2).transition().duration(duration).delay(delayTime);	
						delayTime = delayTime+duration;
						//alert(delayTime);
					}
					prex=x;
					prey1=y1;
					prey2=y2;
			}
		}
	}	
	addLegend();
}

function drawAxis(svg,width, height,numOfScores,index,tennisMatch){
	
	y= d3.scale.ordinal();
	y.rangePoints([0,height-height_yaxe-height_axe]);
	//console.log("yaxis="+(height-height_yaxe-height_axe));
	y.domain([60, 50, 40, 30, 15, 0]);
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");
	yAxis.innerTickSize(7);
	yAxis.outerTickSize(2);
	yAxis.tickFormat(function(d) { 
		if(d==40){
			return "40/deuce";
		}
		if(d==50){
			return "ads";
		}  
		if(d==60){
			return "win";
		}  
		return d;
	});
	//yAxis.ticks(3);
	
	svg.append("g")
	.attr("class", "yaxis")
	.attr("transform", "translate(" + width_axe + "," + height_axe + ")");
	 
	svg.selectAll(".yaxis").transition()
	.call(yAxis)
	
	var numOfGames=tennisMatch.sets[index].host+tennisMatch.sets[index].guest;
	var dates=[];
	for(i=0;i<numOfGames;i++){
		dates.push(format.parse(tennisMatch.sets[index].games[i].start));
		dates.push(format.parse(tennisMatch.sets[index].games[i].end));
	}
	/*
	var x = d3.scale.linear();
	x.range([0, width-2*width_axe]);
	x.domain([0,numOfScores]);
	var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");		
	xAxis.innerTickSize(7);
	xAxis.outerTickSize(2);
	xAxis.ticks(numOfScores/2);
	//xAxis.ticks(0);
	*/
	
	xtime=d3.time.scale();
	xtime.range([0, width-2*width_axe]);
	xtime.domain([d3.time.minute.offset(dates[0], -1),dates[dates.length-1]]);
	var xAxis = d3.svg.axis()
			.scale(xtime)
			.orient("bottom");		
	xAxis.innerTickSize(7);
	xAxis.outerTickSize(2);
	xAxis.tickValues(dates);
	xAxis.tickFormat(function(d,i){
			var commasFormatter1 = d3.time.format('%H:%M');
			var commasFormatter2 = d3.time.format(':%M');
			if(i%2==0){
				return commasFormatter1(d);
			}
			else{
				return "";
				//return "  "+commasFormatter2(d);
			}
		}
	);

	//xAxis.ticks(numOfScores/2);
	svg.append("g")
	.attr("class", "xaxis")
	.attr("transform", "translate(" + width_axe + "," + (height-height_yaxe)+ ")");
	 
	svg.selectAll(".xaxis").transition()
	.call(xAxis)
	//console.log("here");
}
