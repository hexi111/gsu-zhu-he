var y ;
var format = d3.time.format("%b %e, %Y %I:%M:%S %p");
var xtime;
var svgs=[];
var numOfSvgs;
var svgStatus=[];
var svgPeople=[];
var svgCharacter;


function svg_dissappear(index){
	svgs[index].selectAll("rect").transition().attr("height",0).attr("y",0).duration(500);
	svgs[index].selectAll("circle").transition().attr("cy",0).attr("r",0).delay(500).duration(500);
	svgs[index].selectAll("line").transition().attr("y1",0).attr("y2",0).attr("x1",0).attr("x2",0).delay(1000).duration(500);
	svgs[index].selectAll(".yaxis").transition().style("display","none").delay(1500).duration(500);
	svgs[index].selectAll(".xaxis").transition().style("display","none").delay(1500).duration(500);
	svgs[index].transition().style("display","none").delay(1500).duration(500);
}

function svg_show(index){
	svgs[index].transition().style("display","block").delay(1500);
	svgs[index].selectAll(".yaxis").transition().style("display","block").delay(1500).duration(500);
	svgs[index].selectAll(".xaxis").transition().style("display","block").delay(1500).duration(500);
	//svgs[index].selectAll("line").transition().attr("y1",0).attr("y2",0).attr("x1",0).attr("x2",0).delay(1000).duration(500);
}

function svg_update(index,people,character){

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
}

function drawLine() {

	
}

function drawMatch(){
	var div_height=$("#content").height()-14;
	var div_width=$("#content").width();
	//console.log("width="+div_width);
	//console.log("height="+div_height);
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
		//console.log("0="+y(0)+" 15="+y(15)+" 30="+y(30)+" 40="+y(40)+" 50="+y(50)+" 60="+y(60));
		//console.log("numOfScores="+numOfScores);
		var sequence=1;
		var x,y1,y3;
		var prex,prey1,prey2;
		var posY=y(60)+height_axe-1;
		for(j=0;j<numOfGames;j++){
			//var posX=sequence*(div_width-2*width_axe)/numOfScores+width_axe;
			//var width=(sequence+tennisMatch.sets[i].games[j].scores.length-1)*(div_width-2*width_axe)/numOfScores+width_axe;
			var posX=xtime(format.parse(tennisMatch.sets[i].games[j].start))+width_axe;
			//console.log("posX="+posX);
			var width=xtime(format.parse(tennisMatch.sets[i].games[j].end))+width_axe;
			//console.log("width="+width);
			//console.log("start="+sequence+" end="+(sequence+tennisMatch.sets[i].games[j].scores.length));
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
				//.attr("fill","#E6E6FF")
				//.attr("fill","#FFEBF5")
				.attr("width", width-posX)
				.attr("height", (div_height/numOfSets-height_yaxe-height_axe));
			
			for(k=0;k<tennisMatch.sets[i].games[j].scores.length;k++){		
					//x=sequence*(div_width-2*width_axe)/numOfScores+width_axe;
					x=xtime(format.parse(tennisMatch.sets[i].games[j].scores[k].timestamp))+width_axe;
					y1=y(tennisMatch.sets[i].games[j].scores[k].host)+height_axe;
					y2=y(tennisMatch.sets[i].games[j].scores[k].guest)+height_axe;
					//if(i==0){
					//console.log("y1="+tennisMatch.sets[i].games[j].scores[k].host+" "+y(tennisMatch.sets[i].games[j].scores[k].host)+" "+y1);
					//console.log("y2="+tennisMatch.sets[i].games[j].scores[k].guest+" "+y(tennisMatch.sets[i].games[j].scores[k].guest)+" "+y2);
					//}
					//y2=y(tennisMatch.sets[i].games[j].scores[k].guest))*(div_height/numOfSets-height_yaxe-height_axe)/6+height_axe;
					//console.log("y1="+y(tennisMatch.sets[i].games[j].scores[k].host)+" height_axe="+div_height/numOfSets-height_yaxe-height_axe);
					//console.log("y2="+y2+" height_axe="+(div_height/numOfSets-height_yaxe-height_axe));
					
					var tmp1=svg.append("circle")
						.attr("cx", x)
						.attr("cy", y(60))
						.attr("r",2)
						.style("stroke", "blue");
						
					
					tmp1.attr("cy",y1).transition().duration(duration).delay(delayTime);	

					//alert(delayTime);
							
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
					/*
					if((tennisMatch.sets[i].games[j].scores[k].host==60)||(tennisMatch.sets[i].games[j].scores[k].guest==60)){
						//break;
						//k=tennisMatch.sets[i].games[j].scores.length;
					}
					if((tennisMatch.sets[i].games[j].scores[k].host==50)&&(tennisMatch.sets[i].games[j].scores[k].guest!=40)){
						//break;
						//k=tennisMatch.sets[i].games[j].scores.length;
					}	
					if((tennisMatch.sets[i].games[j].scores[k].guest==50)&&(tennisMatch.sets[i].games[j].scores[k].host!=40)){
						//break;
						//k=tennisMatch.sets[i].games[j].scores.length;
					}
					*/			
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
			return "50/ads";
		}    
		return d;
	});
	//yAxis.ticks(3);
	
	svg.append("g")
	.attr("class", "yaxis")
	.attr("transform", "translate(" + width_axe + "," + height_axe + ")");
	 
	svg.selectAll(".yaxis").transition()
	.duration(duration)
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
	.duration(duration)
	.call(xAxis)
	//console.log("here");
}
