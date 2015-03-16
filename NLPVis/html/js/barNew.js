/*
These vars are used to restore the bar chars.
*/
var change_bak=[0,0,0,0];
var svg_bak=[];
var x_bak=[];
var xAxis_bak=[];
var width_bak=[];
var height_bak=[];
var i_bak=[];
var data_bak=[];
var status_bak=[];
status_bak[0]=[];
status_bak[1]=[];
status_bak[2]=[];
status_bak[3]=[];

function restore(index){
	if(change_bak[index]==1){
		downNew(data_bak[index],i_bak[index],svg_bak[index], x_bak[index], xAxis_bak[index], width_bak[index], height_bak[index],1,index,0,1);
		var i=0;
		for(i=0;i<status_bak[index].length;i++){
			if(status_bak[index][i]==0){
				//downNew(data_bak[index].children[i],i,svg_bak[index], x_bak[index], xAxis_bak[index], width_bak[index], height_bak[index],1,index,0,1);
			}
			else{
				//downNew(data_bak[index].children[i],i,svg_bak[index], x_bak[index], xAxis_bak[index], width_bak[index], height_bak[index],1,index,0,1);
				downNew(data_bak[index].children[i],i,svg_bak[index], x_bak[index], xAxis_bak[index], width_bak[index], height_bak[index],1,index,0,1);
			}
		}
	}
}

function drawArticlesNew(path,index, w, h, article) {

	var width = w - margin.left - margin.right;
	var height = h - margin.top - margin.bottom;

	var x = d3.scale.linear()
		.range([0, width]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("top");
	
	d3.select(path).select("svg").remove();
	var svg = d3.select(path).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("rect")
		.attr("id","background"+index)
		.attr("class", "background")
		.attr("width", width)
		.attr("height", height)
		.attr("title","click to go parent level")
		.on("click", function(d,i){
	      upNew(d, i,svg, x, xAxis, width, height,index);
		});

	svg.append("g")
		.attr("class", "x axis");

	svg.append("g")
		.attr("class", "y axis")
	  .append("line")
		.attr("y1", "100%");

	partition.nodes(article);
	
	svg.append("text")
	  .attr("x", width-4)
	  .attr("y", height-6)
	  .attr("dy", ".40em")
	  .style("fill","#140F44")
	  .style("text-anchor", "end")
	  .text(article.name);
		
	x.domain([0, article.value]).nice();
  	downNew(article, 0,svg,x,xAxis, width, height,0,index,0,0);
}

// index: id for bar chart
// ifWords: small rectangle;
// flag: if it is the initial call

function downNew(d, i, svg, x, xAxis, width, height,flag,index,ifWords,isrecovery){
  
  if((d.children)&&(flag==1)&&(isrecovery==0)){
  	change_bak[index]=1;
  	svg_bak[index]=svg;
	x_bak[index]=x;
	xAxis_bak[index]=xAxis;
	width_bak[index]=width;
	height_bak[index]=height;
	data_bak[index]=d;
	i_bak[index]=i;  	
  	var iter=0;
  	status_bak[index]=[];
  	for(iter=0;iter<d.children.length;iter++){
  		status_bak[index][iter]=0;
  	}
  }
  
  if((!d.children)&&(flag==1)&&(isrecovery==0)){
  	if(ifWords==0){
	  	status_bak[index][i]=1;
  	}
  	else {
	  	status_bak[index][i]=0;
  	}
  }
  
  //console.log(d.depth);
  if(flag==1){
  	if(index!=currentPos){
  		d3.select("#background"+currentPos).style("fill",colorInactive);
  		svg.select("rect").style("fill",colorActive); 		
		changeCurrentPos(index);
  	}
  }
  // already on the sentence levels;
  if (!d.children || this.__transition__) {
  	
  	/*
  	if(atree[index]!=null){
  		atree[index].remove();
  	}
  	atree[index]=svg
	 .append("g")
	 .attr("transform", "translate(3,"+(height-25)+")")
	 .on("click", function(){
		window.open("tree/treeview.html?tree="+d.structure, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=0, left=0, width="+window.innerWidth+", height="+window.innerHeight);      	
	})
	.style("cursor", function() { 
		return "pointer"; 
	});
	

	atree[index].append("rect")
	.attr("width",x(7))
	.attr("fill","#F7F6F5")
	.attr("stroke","black")
	.attr("height",barHeight);


	atree[index].append("text")
	.attr("x", 45)
	.attr("y", 10)
	.attr("dy",".35em")
	.style("text-anchor", "end")
	.text("Tree "+d.id);
	*/
	
	// display a small rectangle for each word.
  	if(ifWords==0){
  		//var smallRectWidth=d.value/d3.max(d.parent.children,function(d){ return d.value;});
  		var aRow=svg.selectAll(".enter").selectAll("g").filter(function(p){return p==d;});
  		//aRow.on("mouseover",null).on("mouseout",null).on("click",null);
  		aRow.on("click",null);
  		//aRow.on("click",null);
  		aRow.select("rect").remove();
  		aRow.selectAll("rect").data(function(dd){return dd.types})
  		.enter().append("rect")
  		.style("cursor", function(d) { return "pointer"; })   
  		.attr("width", function() { return x(1); })
		.attr("height", barHeight)
		.attr("id",function(dd,i){
			return dd.id;
		})
		/*
		.on("hover",function(dd,i){
			if(index==currentPos){
				var txt=d3.select("#"+dd.id);
				txt.attr("class",dd.kind);
			}
		})
		*/	
		.on("mouseover",function(dd,i){
			if(index==currentPos){
				wrd=d3.select("#"+dd.id);
				/*
				if(speechOrFreq){
					wrd.attr("class",dd.kind);
				}
				else{
					wrd.attr("class",dd.freq);
				}
				*/
				wrd.style("color", function(){
					if(speechOrFreq){
						return speeches.filter(function (el) {
							return el.name==dd.kind ;
						})[0].color;
					}
					return freqs.filter(function (el) {
						return el.name==dd.freq ;
					})[0].color;		
 				});
			}
		})	
		.on("mouseout",function(dd,i){
			if(index==currentPos){
				if(speechOrFreq){
					//wrd.classed(dd.kind,false);
					wrd.style("color",null);
				}
				else{
					//wrd.classed(dd.freq,false);
					wrd.style("color",null);
				}
			}
		})		
		/*
		.attr("class", function(dd,i){			
			if(speechOrFreq){
				return dd.kind+"F";
			}
			return dd.freq+"f";
			
		})
		*/
		.style("fill", function(dd,i){
			if(speechOrFreq){
				return speeches.filter(function (el) {
 					return el.name==dd.kind ;
 				})[0].color;
			}
			return freqs.filter(function (el) {
 				return el.name==dd.freq ;
 			})[0].color;		
 		})
		.attr("transform", function(dd,i){
			var tx = "translate(" + x(1) * i  + "," + 0 + ")";
			return tx;
		})
		.on("click", function(dd,ii){
			//wrd.classed(dd.kind,false);
      		wrd.style("color",null);
      		downNew(d, i, svg, x, xAxis, width, height,1,index,1,0);
      	});      	
  	}
  	else if(ifWords==1){
  		var aRow=svg.selectAll(".enter").selectAll("g").filter(function(p){return p==d;});
  		aRow.selectAll("rect").remove();
  		//aRow.on("mouseover",null).on("mouseout",null).on("click",null);
 		aRow.on("click",null);
  		//aRow.on("hover",null).on("click",null);


  		aRow.append("rect")
  		.attr("width",function(){return x(d.value);})
		.attr("height", barHeight)
		.style("fill", color(true))
		.attr("id",d.id)
		.style("cursor", function(dd) { return "pointer"; })
      	.on("mouseover",function(){
      		if(index==currentPos){
				txt=d3.select("#"+d.id);
				txt.style('color',colorSelected);
			}
      	})
      	.on("mouseout",function(){
      		if(index==currentPos){
				//var txt=d3.select("#"+d.id);
				txt.style('color',null);
      		}
      	})
      	/*
      	.on("hover",function(){
      		if(index==currentPos){
				var txt=d3.select("#"+d.id);
				alert(txt.html());
				txt.style('color',colorSelected);
			}
      	})
      	*/
      	.on("click", function(){
      		downNew(d, i, svg, x, xAxis, width, height,1,index,0,0);
      	});
  	}
  	return;
  }
 
  var end = duration + d.children.length * delay;

	  // Mark any currently-displayed bars as exiting.
	  var exit = svg.selectAll(".enter")
		  .attr("class", "exit");

	// Entering nodes immediately obscure the clicked-on bar, so hide it.
	exit.selectAll("rect").filter(function(p) { return p === d; })
		  .style("fill-opacity", 1e-6);

	 // Update the x-scale domain.
	x.domain([0, d3.max(d.children, function(d) { return d.value; })]).nice();
	
	  // Enter the new bars for the clicked-on data.
	  // Per above, entering bars are immediately visible.
	var enter = barNew(d, svg, x, xAxis, width, height,index)
		  .attr("transform", stackNew(i,x))
		  .style("opacity", 1);

	  // Have the text fade-in, even though the bars are visible.
	  // Color the bars as parents; they will fade to children if appropriate.
	enter.select("text").style("fill-opacity", 1e-6);
	enter.select("rect").style("fill", colorNew(true));

	if((d.children)&&(flag==1)){
		enter.select("text")
		//.style("text-decoration", "underline")
		.style("cursor", function(d) { return "pointer"; })   
		.attr("class","blue")
		.on("click", function(d,i){
	   		 window.open("tree/treeview.html?tree="+d.structure, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=0, left=0, width="+window.innerWidth+", height="+window.innerHeight);      	
      	});
	}
	  // Update the x-axis.
	  svg.selectAll(".x.axis").transition()
		  .duration(duration)
		  .call(xAxis);

	  // Transition entering bars to their new position.
	  var enterTransition = enter.transition()
		  .duration(duration)
		  .delay(function(d, i) { return i * delay; })
		  .attr("transform", function(d, i) { return "translate(0," + barHeight * i * 1.2 + ")"; });

	  // Transition entering text.
	  enterTransition.select("text")
		  .style("fill-opacity", 1);

	  // Transition entering rects to the new x-scale.
		enterTransition.select("rect")
		  .attr("width", function(d) { return x(d.value); })
		  .style("fill", function(d) { return colorNew(!!d.children); });
	  // Transition exiting bars to fade out.
	  var exitTransition = exit.transition()
		  .duration(duration)
		  .style("opacity", 1e-6)
		  .remove();

	  // Transition exiting bars to the new x-scale.
	  //exitTransition.selectAll("rect")
	  //	  .attr("width", function(d) { return x(d.value); });
	  //}

  // Rebind the current node to the background.
  svg.select(".background")
      .datum(d)
  	  .transition()
      .duration(end);

  d.index = i;
}

function upNew(d, i, svg, x, xAxis, width, height,index) {

  change_bak[index]=0;
		
  if(index!=currentPos){
	d3.select("#background"+currentPos).style("fill",colorInactive);
	svg.select("rect").style("fill",colorActive); 		
	changeCurrentPos(index);
  }

  if (!d.parent || this.__transition__) return;
  var end = duration + d.children.length * delay;

  // Mark any currently-displayed bars as exiting.
  var exit = svg.selectAll(".enter")
      .attr("class", "exit");

  // Enter the new bars for the clicked-on data's parent.

  var enter = barNew(d.parent, svg, x, xAxis, width, height,index)
      .attr("transform", function(d, i) { return "translate(0," + barHeight * i * 1.2 + ")"; })
      .style("opacity", 1e-6);

  // Color the bars as appropriate.
  // Exiting nodes will obscure the parent bar, so hide it.
  enter.select("rect")
      .style("fill", function(d) { return colorNew(!!d.children); })
    .filter(function(p) { return p === d; })
      .style("fill-opacity", 1e-6);

  // Update the x-scale domain.
  x.domain([0, d3.max(d.parent.children, function(d) { return d.value; })]).nice();

  // Update the x-axis.
  svg.selectAll(".x.axis").transition()
      .duration(duration)
      .call(xAxis);

  // Transition entering bars to fade in over the full duration.
  var enterTransition = enter.transition()
      .duration(end)
      .style("opacity", 1);

  // Transition entering rects to the new x-scale.
  // When the entering parent rect is done, make it visible!
  enterTransition.select("rect")
      .attr("width", function(d) { return x(d.value); })
      .each("end", function(p) { if (p === d) d3.select(this).style("fill-opacity", null); });

  // Transition exiting bars to the parent's position.
  var exitTransition = exit.selectAll("g").transition()
      .duration(duration)
      .delay(function(d, i) { return i * delay; })
      .attr("transform", stackNew(d.index,x));

  // Transition exiting text to fade out.
  exitTransition.select("text")
      .style("fill-opacity", 1e-6);

  // Transition exiting rects to the new scale and fade to parent color.
  	if(d.depth!=depth){
	  exitTransition.select("rect")
		  .attr("width", function(d) { return x(d.value); })
		  .style("fill", colorNew(true));
	}
	else{
		  exitTransition.selectAll("rect")
		  .attr("width", function(d) { return x(1); })
		  .style("fill", colorNew(true));
		  
	}
	if(atree[index]!=null){
		atree[index].transition().duration(end).remove();
  	}
  // Remove exiting nodes when the last child has finished transitioning.
  exit.transition()
      .duration(end)
      .remove();

  // Rebind the current parent to the background.
  svg.select(".background")
      .datum(d.parent)
    .transition()
      .duration(end);
}

// Creates a set of bars for the given data node, at the specified index.

function barNew(d, svg, x, xAxis, width, height,index) {
  var bar = svg.insert("g", ".y.axis")
      .attr("class", "enter")
      .attr("transform", "translate(0,5)")
  	  .selectAll("g")
      .data(d.children)
		.enter().append("g")
      .on("mouseover",function(d,i){
      		if(index==currentPos){
				var txt=d3.select("#"+d.id);
				txt.style('color',colorSelected);
			}
      })
      .on("mouseout",function(d,i){
      		if(index==currentPos){
				var txt=d3.select("#"+d.id);
				txt.style('color',null);
      		}
      });


  bar.append("text")
      .attr("x", -6)
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d.name; });


  bar.append("rect")
      .attr("width", function(d) { return x(d.value); })
      .attr("height", barHeight) 
      .style("cursor", function(d) { return "pointer"; })   
      .on("click", function(d,i){
      	if(txt!=null){
      		txt.style('color',null);
      	}
      	downNew(d, i, svg, x, xAxis, width, height,1,index,0,0);
      });
	  //.attr("title",function(d){return d.value});
	  
  return bar;
}

function stackNew(i, x) {
  var x0 = 0;
  return function(d) {
    var tx = "translate(" + x0 + "," + barHeight * i * 1.2 + ")";
    x0 += x(d.value);
    return tx;
  };
}

