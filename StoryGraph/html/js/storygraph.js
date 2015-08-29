var records_sg1;
var latMax;
var latMin;
var lonMax;
var lonMin;
var dateMax;
var dateMin;

var duration = 250;
var width;
var height;
var width_margin=30;
var height_margin=30;
var width_axe=50;
var height_axe=20;
var height_yaxe=35;

var map;

// This function is used to extract the parsed sentence from the passed html parameter.
function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

function loadStoryGraph1() {  
	/*                 
    $.post('/StoryGraph/dataProviderServlet',"key="+getURLParameter("key")+"&lat1="+getURLParameter("lat1")+"&lat2="+getURLParameter("lat2")+"&lon1="+getURLParameter("lon1")+"&lon2="+getURLParameter("lon2") ,function(responseText) {
		var str=getURLParameter("link").replace(/\$/g,"\&");
		//console.log(str);
		$("#link2").attr('href', str);
		//	window.open(str," _blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=0, left=0, width="+window.innerWidth+", height="+window.innerHeight);
		//});
		//console.log(responseText);
		var str=responseText.content.replace(/\|\|/g,"\n");
		//console.log(str);
		//records_sg1 = $.csv.toObjects(data);
		var dsv = d3.dsv("|", "text/plain");
		records_sg1=dsv.parse(str);
		dataClean();
		drawAxes();
		drawLines(); 
	});
	*/
	records_sg1=[];
	records.forEach(function(element,index){
		if((element["latitude"]>=lat1)&&(element["latitude"]<=lat2)&&(element["longitude"]>=lon1)&&(element["longitude"]<=lon2)){
			records_sg1.push(element);
		}		
	});
	//console.log(records_sg1);
	dataClean();
	drawAxes();
	//}
	drawLines(); 
	
	/*
	$.ajax({
		type: "GET",
		url: "afg_output.csv",
		success: function(data) {
			//console.log(csv);
			records_sg1 = $.csv.toObjects(data);
			//console.log(records_sg1.length);
			//console.log(records_sg1[0].year);
			dataClean();
			drawAxes();
			drawLines(); 
		},
		dataType: "text",
		mimeType: "text/plain"
	 });
	 */	
};

function drawAxes(){

	width=window.innerWidth/2-10;
	height=window.innerHeight;
	
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
	y2Axis.ticks(30);


	var x = d3.time.scale()
		.range([0, width-width_margin-2*width_axe]);
	x.domain([dateMin,dateMax]);

	var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");
			
	xAxis.innerTickSize(7);
	xAxis.outerTickSize(2);
	xAxis.tickFormat(d3.time.format('%m/%d'));
	//xAxis.ticks(30);
	
	var svg = d3.select("#content").append("svg")
		.attr("width", width-width_margin)
		.attr("height", height-height_margin);
				  
	svg.append("g")
		.attr("class", "xaxis")
		.attr("transform", "translate(" + (width_axe) + "," + (height-height_margin-height_yaxe) + ")");
	 
	svg.selectAll(".xaxis").transition()
	  .duration(duration)
	  .call(xAxis)
	
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

function dataClean(){

	latMax=d3.max(records_sg1,function(d){return d.latitude});
	latMin=d3.min(records_sg1,function(d){return d.latitude});
	//console.log(latMax);
	//console.log(latMin);
	lonMax=d3.max(records_sg1,function(d){return d.longitude});
	lonMin=d3.min(records_sg1,function(d){return d.longitude});
	//console.log(lonMax);
	//console.log(lonMin);
	dateMax=d3.max(records_sg1,function(d){
		//return d.date1;
		var format = d3.time.format("%m/%d/%Y %H:%M");
		var datevar=format.parse(d.date);
		//console.log(datevar);
		return datevar;
	});
	//console.log(dateMax);
	dateMin=d3.min(records_sg1,function(d){
		//return d.date1;
		var format = d3.time.format("%m/%d/%Y %H:%M");
		var datevar=format.parse(d.date);
		//console.log(datevar);
		return datevar;
	});
	//console.log(dateMin);
	//var dateMin=d3.min(records_sg1,function(d){return d.longitude});
}

function drawLines(){
	records_sg1.forEach(function(element,index){
		var x1=width_axe;
		var y1=(element["latitude"]-latMin)*(height-height_margin-height_yaxe-height_axe)/(latMax-latMin)+height_axe;
		var x2=(width-width_margin-width_axe);
		var y2=(element["longitude"]-lonMin)*(height-height_margin-height_yaxe-height_axe)/(lonMax-lonMin)+height_axe;
		if(element["secretcolumn"]>0){
			d3.select("svg").append("line")          // attach a line
				.style("stroke", "grey")  // colour the line
				.attr("x1", x1)     // x position of the first end of the line
				.attr("y1", y1)      // y position of the first end of the line
				.attr("x2", x2)     // x position of the second end of the line
				.attr("y2", y2);    // y position of the second end of the line
		}
		else{
			//console.log("repeat");
		}
		var format = d3.time.format("%m/%d/%Y %H:%M");
		var t=format.parse(element["date"]);
		//console.log("index="+index+" "+x1+" "+y1+" "+x2+" "+y2+" "+t.getTime());
		var x3=(t.getTime()-dateMin.getTime())*(width-width_margin-2*width_axe)/(dateMax.getTime()-dateMin.getTime())+width_axe;
		var y3=(y2-y1)/(x2-x1)*(x3-x1)+y1;
		d3.select("svg").append("circle")
			.attr("cx", x3)
			.attr("cy", y3)
			.attr("r",2)
			.style("stroke", "blue");
		//console.log("x3="+x3);
		//console.log("y3="+y3);
	});
}
