var records;
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

//var previousId;
var preLatitude=-1.0;
var preLongitude=-1.0;
var preLat1=-1.0;
var preLat2=-1.0;
var preLng1=-1.0;
var preLng2=-1.0;
$(document).ready(function() {                 
    $.post('/StoryGraph/dataProviderServlet',"key="+getURLParameter("key")+"&lat1="+getURLParameter("lat1")+"&lat2="+getURLParameter("lat2")+"&lon1="+getURLParameter("lon1")+"&lon2="+getURLParameter("lon2") ,function(responseText) {
		//console.log(responseText);
		var str=responseText.content.replace(/\|\|/g,"\n");
		//console.log(str);
		//records = $.csv.toObjects(data);
		var dsv = d3.dsv("|", "text/plain");
		records=dsv.parse(str);
		dataClean();
		drawAxes();
		drawLines(); 
		setInterval(function(){
			
			//console.log("previousId="+previousId);
			//console.log("localStorage.id="+localStorage.id);
			//console.log("preLatitude"+preLatitude);
			//console.log("preLongitude"+preLongitude);
			
			/*
			if((preLatitude!=null)&&(preLongitude!=null)){
				d3.select("body").select("svg").selectAll("circle")
				.attr("r",function(d){
					return 2;
				})
				.style("stroke",function(d){
					return red;
				});
			}
			*/
 			if((localStorage.latitude!=preLatitude)&&(localStorage.longitude!=preLongitude)){
 				d3.select("body").select("svg").selectAll("circle")
				.attr("r",function(d){
					if((d.latitude==localStorage.latitude)&&(d.longitude==localStorage.longitude)){
						return 3;
					}
					else{
						return 2;
					}
				})
				.style("stroke",function(d){
					if((d.latitude==localStorage.latitude)&&(d.longitude==localStorage.longitude)){
						return "blue";
					}
					else{
						return "red";
					}
				});	
				preLatitude=localStorage.latitude;
				preLongitude=localStorage.longitude;
 			} 
 			
 			if((localStorage.lat1!=preLat1)&&(localStorage.lat2!=preLat2)&(localStorage.lng1!=preLng1)&&(localStorage.lng2!=preLng2)){
 				console.log("here");
				console.log("lat1="+localStorage.lat1+"lat2="+localStorage.lat2+"lng1="+localStorage.lng1+"lng2="+localStorage.lng2); 			
 				d3.select("body").select("svg").selectAll("circle")
				.attr("r",function(d){
					if((d.latitude>=localStorage.lat1)&&(d.latitude<=localStorage.lat2)&&(d.longitude>=localStorage.lng1)&&(d.longitude>=localStorage.lng2)){
						console.log("latitude="+d.latitude+" longitude="+d.longitude);
						return 3;
					}
					else{
						return 2;
					}
				})
				.style("stroke",function(d){
					if((d.latitude>=localStorage.lat1)&&(d.latitude<=localStorage.lat2)&&(d.longitude>=localStorage.lng1)&&(d.longitude>=localStorage.lng2)){
						console.log("latitude="+d.latitude+" longitude="+d.longitude);
						return "blue";
					}
					else{
						return "red";
					}
				});	
				preLat1=localStorage.lat1;
				preLat2=localStorage.lat2;
				preLng1=localStorage.lng1;
				preLng2=localStorage.lng2;
 			} 
 			
 		}, 2000);
	});
	
	/*
	$.ajax({
		type: "GET",
		url: "afg_output.csv",
		success: function(data) {
			//console.log(csv);
			records = $.csv.toObjects(data);
			//console.log(records.length);
			//console.log(records[0].year);
			dataClean();
			drawAxes();
			drawLines(); 
		},
		dataType: "text",
		mimeType: "text/plain"
	 });
	 */	
});

function drawAxes(){

	width=window.innerWidth;
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
	y2Axis.ticks(0);
	

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

	latMax=d3.max(records,function(d){return d.latitude});
	latMin=d3.min(records,function(d){return d.latitude});
	//console.log(latMax);
	//console.log(latMin);
	lonMax=d3.max(records,function(d){return d.longitude});
	lonMin=d3.min(records,function(d){return d.longitude});
	//console.log(lonMax);
	//console.log(lonMin);
	dateMax=d3.max(records,function(d){
		//return d.date1;
		var format = d3.time.format("%m/%d/%Y %H:%M");
		var datevar=format.parse(d.date);
		//console.log(datevar);
		return datevar;
	});
	//console.log(dateMax);
	dateMin=d3.min(records,function(d){
		//return d.date1;
		var format = d3.time.format("%m/%d/%Y %H:%M");
		var datevar=format.parse(d.date);
		//console.log(datevar);
		return datevar;
	});
	//console.log(dateMin);
	//var dateMin=d3.min(records,function(d){return d.longitude});
}

function drawLines(){

	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
		return "<span style='color:blue'>" + d.event+ "</span><strong> on </strong> <span style='color:blue'>" + d.date+ "</span>";
	  })
	d3.select("body").select("svg").call(tip);
	records.forEach(function(element,index){
		var x1=width_axe;
		var y1=(element["latitude"]-latMin)*(height-height_margin-height_yaxe-height_axe)/(latMax-latMin)+height_axe;
		var x2=(width-width_margin-width_axe);
		//var y2=(element["longitude"]-lonMin)*(height-height_margin-height_yaxe-height_axe)/(lonMax-lonMin)+height_axe;
		var y2=y1;
		if(element["secretcolumn"]>0){
			var str="("+element["latitude"];
			str=str+","+element["longitude"]+") ";
			records.forEach(function(e,i){
				if((e.latitude==element["latitude"])&&(e.longitude==element["longitude"])){
					str=str+" event:"+e.date;
				}
			});
			/*
			tmp.forEach(function(d,index){
				str=str+"event"+index+":"+d.time;  
			});
			*/
			var tooltip = d3.select("body")
				.append("div")
				.style("position", "absolute")
				.style("z-index", "10")
				.style("visibility", "hidden")
				.text(str);
			d3.select("svg").append("line")          // attach a line
				.style("stroke", "grey")  // colour the line
				.attr("x1", x1)     // x position of the first end of the line
				.attr("y1", y1)      // y position of the first end of the line
				.attr("x2", x2)     // x position of the second end of the line
				.attr("y2", y2)	    // y position of the second end of the line
				.style("stroke-width",1) 
				.on("click", function(d,i){
			      //alert(element["latitude"]);
				})
				.on("mouseover",function(){
					tooltip.style("visibility", "visible");
					d3.select(this).style("stroke","blue").style("stroke-width",2);
				})
				.on("mouseout",function(){
					tooltip.style("visibility", "hidden");
					d3.select(this).style("stroke","grey").style("stroke-width",1);
					//tip.hide();
				});
		}
		else{
			//console.log("repeat");
		}
	});
	

		//console.log("index="+index+" "+x1+" "+y1+" "+x2+" "+y2+" "+t.getTime());
	d3.select("body").select("svg").selectAll("circle").data(records).enter().append("circle")
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
		.attr("id",function(d){
			return d["id"];
		})
		.style("stroke", "red")
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
