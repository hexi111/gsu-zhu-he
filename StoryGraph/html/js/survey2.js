var records_sg;
var records_sg_select;
var latMax;
var latMin;
var lonMax;
var lonMin;
var dateMax;
var dateMin;

var duration = 250;
var width;
var height;
var width_margin=40;
var height_margin=30;
var width_axe=50;
var height_axe=20;
var height_yaxe=35;
var markers=[];


//var ifDrawed=0;
var map;

$(document).ready(function() { 
	loadStoryGraph();
});

// This function is used to extract the parsed sentence from the passed html parameter.
function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

function updateSG(date1,date2){
	console.log("date1="+date1);
	console.log("date2="+date2);
	var format = d3.time.format("%m/%d/%Y %H:%M");
	records_sg_select=[];
	records_sg.forEach(function(element,index){
		var dateTmp=format.parse(element["date"]);
		if((dateTmp>=date1)&&(dateTmp<=date2)){
			records_sg_select.push(element);
		}		
	});
	
	console.log("records_sg_select length="+records_sg_select.length);
	
	
	tip= d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(function(d) {
		return "<span style='color:blue'>" + d.event+ "</span><strong> on </strong> <span style='color:blue'>" + d.date+ "</span>";
	});
	d3.select("body").select("svg").call(tip);
	
	d3.select("body").select("svg").selectAll(".myline").remove();
	d3.select("body").select("svg").selectAll(".dot").remove();
	

	records_sg_select.forEach(function(element,index){
		var x1=width_axe;
		var y1=(element["latitude"]-latMin)*(height-height_margin-height_yaxe-height_axe)/(latMax-latMin)+height_axe;
		var x2=(width-width_margin-width_axe);
		//var y2=(element["longitude"]-lonMin)*(height-height_margin-height_yaxe-height_axe)/(lonMax-lonMin)+height_axe;
		var y2=y1;
		if(element["secretcolumn"]>0){
			/*
			var str="("+element["latitude"];
			str=str+","+element["longitude"]+") ";
			records_sg.forEach(function(e,i){
				if((e.latitude==element["latitude"])&&(e.longitude==element["longitude"])){
					str=str+" event:"+e.date;
				}
			});
			*/
			/*
			tmp.forEach(function(d,index){
				str=str+"event"+index+":"+d.time;  
			});
			*/
			/*
			var tooltip = d3.select("body")
				.append("div")
				.style("position", "absolute")
				.style("z-index", "100")
				.style("visibility", "hidden")
				.text(str);
			*/
			d3.select("svg").append("line")          // attach a line
				.style("stroke", "grey")  // colour the line
				.attr("x1", x1)     // x position of the first end of the line
				.attr("y1", y1)      // y position of the first end of the line
				.attr("x2", x2)     // x position of the second end of the line
				.attr("y2", y2)	    // y position of the second end of the line
				.attr("class","myline")
				.style("stroke-width",1) 
				.on("click", function(d,i){
			      //alert(element["latitude"]);
				})
				.on("mouseover",function(){
					//tooltip.style("visibility", "visible");
					//var marker=this.marker;
					//var info=marker.infowindow;
					//info.open(map,marker);
					d3.select(this).style("stroke","blue").style("stroke-width",2);
				})
				.on("mouseout",function(d){
					//tooltip.style("visibility", "hidden");
					//var marker=this.marker;
					//var info=marker.infowindow;
					//info.close();
					d3.select(this).style("stroke","grey").style("stroke-width",1);
					//tip.hide();
				});
		}
		else{
			//console.log("repeat");
		}
	});
	

		//console.log("index="+index+" "+x1+" "+y1+" "+x2+" "+y2+" "+t.getTime());
		d3.select("body").select("svg").selectAll(".dot").data(records_sg_select,function(d){
			return d.id;
		}).enter().append("circle")
		.attr("cx", function(d){
			var format = d3.time.format("%m/%d/%Y %H:%M");
			var t=format.parse(d["date"]);
			var x3=(t.getTime()-dateMin.getTime())*(width-width_margin-2*width_axe)/(dateMax.getTime()-dateMin.getTime())+width_axe;
			return x3;
		})
		.attr("cy", function(d){
			var format = d3.time.format("%m/%d/%Y %H:%M");
			var t=format.parse(d["date"]);
			var x3=(t.getTime()-dateMin.getTime())*(width-width_margin-2*width_axe)/(dateMax.getTime()-dateMin.getTime())+width_axe;
			var x1=width_axe;
			var y1=(d["latitude"]-latMin)*(height-height_margin-height_yaxe-height_axe)/(latMax-latMin)+height_axe;
			var x2=(width-width_margin-width_axe);
			var y2=y1;
			var y3=(y2-y1)/(x2-x1)*(x3-x1)+y1;
			return y3;
		})
		.attr("r",2)
		.attr("class","dot")
		.attr("id",function(d){
			return d["id"];
		})
		.style("stroke", "blue")
		.on("click", function(d,i){
			 //d3.select(this).style("stroke", "blue");
		})
		.on('mouseover', tip.show)
		//.on("mouseover",function(d){
		//	tip.show();
		//})
		.on("mouseout",function(d){
			tip.hide();
		});
	
	/*
	var circles=d3.select("body").select("svg").selectAll(".dot").data(records_sg,function(d1){
			return d1.id;
		});
	
	
	//var circles=d3.select("body").select("svg").selectAll(".dot").data(records_sg_select);   
   circles.enter().append("circle").attr("cx", function(d){
		var format = d3.time.format("%m/%d/%Y %H:%M");
		var t=format.parse(d["date"]);
		var x3=(t.getTime()-dateMin.getTime())*(width-width_margin-2*width_axe)/(dateMax.getTime()-dateMin.getTime())+width_axe;
		return x3;
	})
	.attr("cy", function(d){
		var format = d3.time.format("%m/%d/%Y %H:%M");
		var t=format.parse(d["date"]);
		var x3=(t.getTime()-dateMin.getTime())*(width-width_margin-2*width_axe)/(dateMax.getTime()-dateMin.getTime())+width_axe;
		var x1=width_axe;
		var y1=(d["latitude"]-latMin)*(height-height_margin-height_yaxe-height_axe)/(latMax-latMin)+height_axe;
		var x2=(width-width_margin-width_axe);
		var y2=y1;
		var y3=(y2-y1)/(x2-x1)*(x3-x1)+y1;
		return y3;
	})
	.attr("r",2)
	.attr("class","dot")
	.attr("id",function(d){
		return d["id"];
	})
	.style("stroke", "blue")
	.on("click", function(d,i){
		 //d3.select(this).style("stroke", "blue");
	});
	//.on('mouseover', tip.show)
	//.on("mouseover",function(d){
	//	tip.show();
	//})
	//.on("mouseout",function(d){
	//	tip.hide();
	//});
	circles.exit()
	.transition()
   .duration(750)
	.attr("r", 0)
   .remove();
   */
   if((rightDate!=undefined)&&(leftDate!=undefined)){
	   updateMarker();
	}
}

function loadStoryGraph() { 
   var address="address=https://docs.google.com/spreadsheets/d/1M-OZlweFmmou-putBdu9Dj7Kai2tZ8d0hTK28FRAG_8/edit#gid=0" ;
	console.log("loadstorygraph");
	//console.log("lat1="+lat1+" lat2="+lat2+" lon1="+lon1+" lon2="+lon2);               
	$.post('/StoryGraph/dataProviderServlet',address ,function(responseText) {
		var str=responseText.content.replace(/\|\|/g,"\n");
		var dsv = d3.dsv("|", "text/plain");
		//console.log(str);
		records_sg=dsv.parse(str);
		console.log(records_sg);
		dataClean1();
		drawAxes1();
		drawLines1();
	});
 
}	

var brush1;
var handle1;
var x;
var brush2;
var handle2;
var leftDate;
var rightDate;
var tip;
var changed=0;

function updateMarker(){
	//var sum=0;
	//var sum1=0;
	for (var i = 0; i < markers.length; i++) {
		if(markers[i]==undefined){
			continue;
		}
		//console.log("i="+i+" date="+markers[i].date);
		var format = d3.time.format("%m/%d/%Y %H:%M");
		var t=format.parse(markers[i].date);
		if((t>=leftDate)&&(t<=rightDate)){
			markers[i].setMap(map);	
			//sum++;	
		}
		else{
			markers[i].setMap(null);
			//sum1++;
		}
  	}
  	//console.log("leftDate="+leftDate);
  	//console.log("rightDate="+rightDate);
  	//console.log("sum="+sum);
  	//console.log("sum1="+sum1);
}

function brushed1() {
  var value = brush1.extent()[0];

  if (d3.event.sourceEvent) { // not a programmatic event
    value = x.invert(d3.mouse(this)[0]);
    brush1.extent([value, value]);
  }
  //console.log("x1(value)="+x(value));
 	
  handle1.attr("cx", x(value));
  //d3.select("body").style("background-color", d3.hsl(value, .8, .8));
}

function brushend1(){
	changed=1;
	var value = brush1.extent()[0];
	if (d3.event.sourceEvent) { // not a programmatic event
		value = x.invert(d3.mouse(this)[0]);
		brush1.extent([value, value]);
	}
	console.log("brushend1");
	leftDate=value;
	updateSG(leftDate,rightDate);	
}

function brushed2() {
  var value = brush2.extent()[0];

  if (d3.event.sourceEvent) { // not a programmatic event
    value = x.invert(d3.mouse(this)[0]);
    brush2.extent([value, value]);
  }
	//console.log("x2(value)="+x(value));
	
  handle2.attr("cx", x(value));
  //d3.select("body").style("background-color", d3.hsl(value, .8, .8));
}

function brushend2(){
  changed=1;
  var value = brush2.extent()[0];
  if (d3.event.sourceEvent) { // not a programmatic event
    value = x.invert(d3.mouse(this)[0]);
    brush2.extent([value, value]);
  }
	console.log("brushend2");
	rightDate=value;
	updateSG(leftDate,rightDate);	
}

function drawAxes1(){

	// for a data set, only draw this axe once.
	//ifDrawed=1;

	width=window.innerWidth-10;
	height=window.innerHeight;
	//width=$("content").width();
	
	//console.log("width= "+width+", height= "+height); 
	
	var y1 = d3.scale.linear()
		.range([height-height_margin-height_yaxe-height_axe,0]);
	y1.domain([latMin,latMax]);

	//console.log(latMax);
	//console.log(latMin);

	var y1Axis = d3.svg.axis()
		.scale(y1)
		.orient("left");

	y1Axis.innerTickSize(7);
	y1Axis.outerTickSize(2);
	y1Axis.ticks(30);
	//y1Axis.tickFormat(d3.format(",.000f"));

	var y2 = d3.scale.linear()
		.range([height-height_margin-height_yaxe-height_axe,0]);
	y2.domain([lonMin,lonMax]);

	
	var y2Axis = d3.svg.axis()
		.scale(y2)
		.orient("right");
	
	
	y2Axis.innerTickSize(7);
	y2Axis.outerTickSize(2);
	y2Axis.ticks(0);
	

	x = d3.time.scale()
		.range([0, width-width_margin-2*width_axe]);
	x.domain([dateMin,dateMax]);

	var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");
			
	xAxis.innerTickSize(7);
	xAxis.outerTickSize(2);
	xAxis.tickPadding(25);
	xAxis.tickFormat(d3.time.format('%m/%d'));
	//xAxis.ticks(30);
	
	d3.select("#content").select("svg").remove();
	var svg = d3.select("#content").append("svg")
		.attr("width", width-width_margin)
		.attr("height", height-height_margin+20);
				  
	svg.append("g")
		.attr("class", "xaxis")
		.attr("transform", "translate(" + (width_axe) + "," + (height-height_margin-height_yaxe) + ")");

	/*
	svg.selectAll(".xaxis").transition()
	  .duration(duration)
	  .call(xAxis)
	*/
	
	svg.select(".xaxis").call(xAxis)  
	.select(".domain")
	.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "halo");
	
	brush1 = d3.svg.brush()
    .x(x)
    .extent([dateMin, dateMin])
    .on("brush", brushed1)
    .on("brushend",brushend1);  
      
      
    brush2 = d3.svg.brush()
    .x(x)
    .extent([dateMax, dateMax])
    .on("brush", brushed2)
    .on("brushend",brushend2);   
      
	var slider1 = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + (width_axe) + "," + (height-height_margin-height_yaxe) + ")")
    .call(brush1)
	
	slider1.selectAll(".extent,.resize")
    .remove();

	slider1.select(".background")
    .attr("height", 10);

	var slider2 = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + (width_axe) + "," + (height-height_margin-height_yaxe+18) + ")")
    .call(brush2)
	
	slider2.selectAll(".extent,.resize")
    .remove();

	slider2.select(".background")
    .attr("height", 10);

	handle1 = slider1.append("circle")
    .attr("class", "handle1")
    .attr("transform", "translate(0," + "8)")
    .attr("r", 7);

    handle2 = slider2.append("circle")
    .attr("class", "handle2")
    .attr("transform", "translate(0," + "8)")
    .attr("r", 7);

	slider1
    .call(brush1.event)
	.transition() // gratuitous intro!
    .duration(750)
    .call(brush1)
    .call(brush1.event);

	slider2
    .call(brush2.event)
	.transition() // gratuitous intro!
    .duration(750)
    .call(brush2)
    .call(brush2.event);
    	
	//var axis = d3.svg.axis().orient("top").ticks(4);
	//d3.select('.xaxis').call(d3.slider().axis(axis));
	
	svg.append("g")
		.attr("class", "y1axis")
		.attr("transform", "translate(" + width_axe + "," + height_axe + ")");
	 
	svg.selectAll(".y1axis").transition()
	  .duration(duration)
	  .call(y1Axis)

	
	svg.append("g")
		.attr("class", "y2axis")
		.attr("transform", "translate(" + (width-width_margin-width_axe) + "," + height_axe + ")");
	
	 
	svg.selectAll(".y2axis").transition()
	  .duration(duration)
	  .call(y2Axis)

}

function dataClean1(){	
	latMax=d3.max(records_sg,function(d){return d.latitude});
	latMin=d3.min(records_sg,function(d){return d.latitude});
	//console.log(latMax);
	//console.log(latMin);
	lonMax=d3.max(records_sg,function(d){return d.longitude});
	lonMin=d3.min(records_sg,function(d){return d.longitude});
	//console.log(lonMax);
	//console.log(lonMin);
	dateMax=d3.max(records_sg,function(d){
		//return d.date1;
		var format = d3.time.format("%m/%d/%Y %H:%M");
		var datevar=format.parse(d.date);
		//console.log(datevar);
		return datevar;
	});
	//console.log(dateMax);
	dateMin=d3.min(records_sg,function(d){
		//return d.date1;
		var format = d3.time.format("%m/%d/%Y %H:%M");
		var datevar=format.parse(d.date);
		//console.log(datevar);
		return datevar;
	});
	date1=dateMin;
	date2=dateMax;
	//console.log(dateMin);
	//var dateMin=d3.min(records_sg,function(d){return d.longitude});
}

function drawLines1(){
	tip= d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(function(d) {
	return "<span style='color:blue'>" + d.even+ "</span><strong> on </strong> <span style='color:blue'>" + d.date+ "</span>";
	});
	d3.select("body").select("svg").call(tip);
	records_sg.forEach(function(element,index){
		var x1=width_axe;
		var y1=(element["latitude"]-latMin)*(height-height_margin-height_yaxe-height_axe)/(latMax-latMin)+height_axe;
		var x2=(width-width_margin-width_axe);
		//var y2=(element["longitude"]-lonMin)*(height-height_margin-height_yaxe-height_axe)/(lonMax-lonMin)+height_axe;
		var y2=y1;
		if(element["secretcolumn"]>0){
			/*
			var str="("+element["latitude"];
			str=str+","+element["longitude"]+") ";
			records_sg.forEach(function(e,i){
				if((e.latitude==element["latitude"])&&(e.longitude==element["longitude"])){
					str=str+" event:"+e.date;
				}
			});
			*/
			/*
			tmp.forEach(function(d,index){
				str=str+"event"+index+":"+d.time;  
			});
			*/
			/*
			var tooltip = d3.select("body")
				.append("div")
				.style("position", "absolute")
				.style("z-index", "100")
				.style("visibility", "hidden")
				.text(str);
			*/
			d3.select("svg").append("line")          // attach a line
				.style("stroke", "grey")  // colour the line
				.attr("x1", x1)     // x position of the first end of the line
				.attr("y1", y1)      // y position of the first end of the line
				.attr("x2", x2)     // x position of the second end of the line
				.attr("y2", y2)	    // y position of the second end of the line
				.attr("class","myline")
				.style("stroke-width",1) 
				.on("click", function(d,i){
			      //alert(element["latitude"]);
				})
				.on("mouseover",function(d){
					//var marker=d.marker;
					//var info=marker.infowindow;
					//info.open(map,marker);
					//tooltip.style("visibility", "visible");
					d3.select(this).style("stroke","blue").style("stroke-width",2);
				})
				.on("mouseout",function(){
					//var marker=d.marker;
					//var info=marker.infowindow;
					//info.close();
					//tooltip.style("visibility", "hidden");
					d3.select(this).style("stroke","grey").style("stroke-width",1);
					//tip.hide();
				});
		}
		else{
			//console.log("repeat");
		}
	});

	//console.log("index="+index+" "+x1+" "+y1+" "+x2+" "+y2+" "+t.getTime());
	d3.select("body").select("svg").selectAll(".dot").data(records_sg).enter().append("circle")
	.attr("cx", function(d){
		var format = d3.time.format("%m/%d/%Y %H:%M");
		var t=format.parse(d["date"]);
		var x3=(t.getTime()-dateMin.getTime())*(width-width_margin-2*width_axe)/(dateMax.getTime()-dateMin.getTime())+width_axe;
		return x3;
	})
	.attr("cy", function(d){
		var format = d3.time.format("%m/%d/%Y %H:%M");
		var t=format.parse(d["date"]);
		var x3=(t.getTime()-dateMin.getTime())*(width-width_margin-2*width_axe)/(dateMax.getTime()-dateMin.getTime())+width_axe;
		var x1=width_axe;
		var y1=(d["latitude"]-latMin)*(height-height_margin-height_yaxe-height_axe)/(latMax-latMin)+height_axe;
		var x2=(width-width_margin-width_axe);
		var y2=y1;
		var y3=(y2-y1)/(x2-x1)*(x3-x1)+y1;
		return y3;
	})
	.attr("r",2)
	.attr("class","dot")
	.attr("id",function(d){
		return d["id"];
	})
	.style("stroke", "blue")
	.on("click", function(d,i){
		 //d3.select(this).style("stroke", "blue");
	})
	.on('mouseover', tip.show)
	//.on("mouseover",function(d){
	//	tip.show();
	//})
	.on("mouseout",function(d){
		tip.hide();
	});

	//console.log("x3="+x3);
	//console.log("y3="+y3);
}
