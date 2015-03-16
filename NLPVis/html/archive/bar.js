
function drawArticles(path,index, w, h, article) {

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
	      up(d, i,svg, x, xAxis, width, height,index);
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
	  .style("fill","#14oF44")
	  .style("text-anchor", "end")
	  .text(article.name);
	
	
	x.domain([0, article.value]).nice();
  	down(article, 0,svg,x,xAxis, width, height,0,index);
	
	/*
	d3.json(file, function(error, root) {
	  partition.nodes(root);
	  x.domain([0, root.value]).nice();
	  down(root, 0,svg,x,xAxis, width, height);
	});
	*/
}

function draw(path, w, h, file) {

	var width = w - margin.left - margin.right;
	var height = h - margin.top - margin.bottom;

	var x = d3.scale.linear()
		.range([0, width]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("top");

	var svg = d3.select(path).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("rect")
		.attr("class", "background")
		.attr("width", width)
		.attr("height", height)
		.attr("title","click to go parent level")
		.on("click", function(d,i){
	      up(d, i,svg, x, xAxis, width, height);
		});

	svg.append("g")
		.attr("class", "x axis");

	svg.append("g")
		.attr("class", "y axis")
	  .append("line")
		.attr("y1", "100%");

	d3.json(file, function(error, root) {
	  partition.nodes(root);
	  x.domain([0, root.value]).nice();
	  down(root, 0,svg,x,xAxis, width, height);
	});
}

function down(d, i, svg, x, xAxis, width, height,flag,index){
  //console.log(d.depth);
  if(flag==1){
  	if(index!=currentPos){
  		d3.select("#background"+currentPos).style("fill",colorInactive);
  		svg.select("rect").style("fill",colorActive); 		
		changeCurrentPos(index);
  	}
  }
  if (!d.children || this.__transition__) return;
 
  var end = duration + d.children.length * delay;

	  // Mark any currently-displayed bars as exiting.
	  var exit = svg.selectAll(".enter")
		  .attr("class", "exit");

	// Entering nodes immediately obscure the clicked-on bar, so hide it.
	if(d.depth!=depth){ 
		exit.selectAll("rect").filter(function(p) { return p === d; })
		  .style("fill-opacity", 1e-6);
	}
	 // Update the x-scale domain.
	if(d.depth!=depth){
		  x.domain([0, d3.max(d.children, function(d) { return d.value; })]).nice();
	}
	else{
		x.domain([0,10]).nice();
	}
	
	  // Enter the new bars for the clicked-on data.
	  // Per above, entering bars are immediately visible.
	if(d.depth!=depth){
		  var enter = bar(d, svg, x, xAxis, width, height,index)
		  .attr("transform", stack(i,x))
		  .style("opacity", 1);
	}
	else{
		  var enter = barword(d, svg, x, xAxis, width, height,index)
		  .attr("transform", stack(i,x))
		  .style("opacity", 1);
	}
	  // Have the text fade-in, even though the bars are visible.
	  // Color the bars as parents; they will fade to children if appropriate.
	enter.select("text").style("fill-opacity", 1e-6);
	if(d.depth!=depth){
		  enter.select("rect").style("fill", color(true));
	}
	else{
		  //enter.selectAll("rect").style("fill", color(true));
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
	if(d.depth!=depth){
		enterTransition.select("rect")
		  .attr("width", function(d) { return x(d.value); })
		  .style("fill", function(d) { return color(!!d.children); });
	}
	else{
		  enterTransition.selectAll("rect")
		  .attr("width", function(d) { return x(1); });

		 atree[index]=svg
		 .append("g")
		 .attr("transform", "translate(3,218)")
		 .on("click", function(){
    		window.open("tree.html?tree="+d.structure, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=0, left=0, width=800, height=400");      	
    	})
		.style("cursor", function() { 
			return "pointer"; 
		});
		

		atree[index].append("rect")
		.attr("width",x(1))
		.attr("fill","#F7F6F5")
		.attr("stroke","black")
		.attr("height",barHeight);


		atree[index].append("text")
      	.attr("x", 23)
      	.attr("y", 10)
      	.attr("dy",".35em")
		.style("text-anchor", "end")
		.text("Tree");
	
		  //.style("fill", function(d) { return color(!!d.children); });
	}
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

function up(d, i, svg, x, xAxis, width, height,index) {

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

  var enter = bar(d.parent, svg, x, xAxis, width, height,index)
      .attr("transform", function(d, i) { return "translate(0," + barHeight * i * 1.2 + ")"; })
      .style("opacity", 1e-6);

  // Color the bars as appropriate.
  // Exiting nodes will obscure the parent bar, so hide it.
  enter.select("rect")
      .style("fill", function(d) { return color(!!d.children); })
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
      .attr("transform", stack(d.index,x));

  // Transition exiting text to fade out.
  exitTransition.select("text")
      .style("fill-opacity", 1e-6);

  // Transition exiting rects to the new scale and fade to parent color.
  	if(d.depth!=depth){
	  exitTransition.select("rect")
		  .attr("width", function(d) { return x(d.value); })
		  .style("fill", color(true));
	}
	else{
		  exitTransition.selectAll("rect")
		  .attr("width", function(d) { return x(1); })
		  .style("fill", color(true));
		  
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

function bar(d, svg, x, xAxis, width, height,index) {
  var bar = svg.insert("g", ".y.axis")
      .attr("class", "enter")
      .attr("transform", "translate(0,5)")
  	  .selectAll("g")
      .data(d.children)
		.enter().append("g")
      .style("cursor", function(d) { return !d.children ? null : "pointer"; })
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
      })
      .on("click", function(d,i){
      down(d, i, svg, x, xAxis, width, height,1,index);
      });

  bar.append("text")
      .attr("x", -6)
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d.name; });

  bar.append("rect")
      .attr("width", function(d) { return x(d.value); })
      .attr("height", barHeight);
	  //.attr("title",function(d){return d.value});

  return bar;
}

function barword(d,svg,x,xAxis,width,height,index){

	var bar = svg.insert("g", ".y.axis")
		.attr("class", "enter")
		.attr("transform", "translate(0,5)")
		.selectAll("g")
		.data(d.children)
		.enter().append("g")
		.style("cursor", function(d) { 
			return "pointer"; 
		})
      	 .on("click", function(d,i){
      		down(d, i, svg, x, xAxis, width, height,1,index);
      	});
          		
	bar.append("text")
      .attr("x", -6)
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d.name; });

	//nested selection
	var smallBar=bar.selectAll("rect").data(function(d) {return d.words;})
		.enter().append("rect")
		.attr("width", function(d) { return x(1); })
		.attr("height", barHeight)
		.attr("id",function(d,i){
			return d.id;
		})
		.on("mouseover",function(d,i){
			if(index==currentPos){
				var txt=d3.select("#"+d.id);
				txt.attr("class",d.kind);
			}
		})	
		.on("mouseout",function(d,i){
			if(index==currentPos){
				var txt=d3.select("#"+d.id);
				txt.classed(d.kind,false);
			}
		})			
		.attr("class", function(d,i){
			//console.log(d);
			return d.kind;
		})
		.attr("transform", function(d,i){
			var tx = "translate(" + x(1) * i  + "," + 0 + ")";
			return tx;
		});
		return bar;
}

// A stateful closure for stacking bars horizontally.

function stack(i, x) {
  var x0 = 0;
  return function(d) {
    var tx = "translate(" + x0 + "," + barHeight * i * 1.2 + ")";
    x0 += x(d.value);
    return tx;
  };
}

