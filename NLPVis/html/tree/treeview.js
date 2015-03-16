var margin = {top: 20, right: 30, bottom: 20, left:30};

var i = 0,
	duration = 700,
	root;

var diagonal;
	
var svg;

// Create a tree layout
var tree;
	
var maxWidth;
var maxHeight;
var width;
var height;
var str;

var speechOrFreq;
var speeches;
var freqs;
var ifShowPosText=0;

var indented=1; // indented level based or regular level based

$(document).ready(function() {                 

	$.cookie.json = true;

	speeches=$.cookie('speeches');
	freqs=$.cookie('freqs');

	$('input:radio[name=words]')[0].checked = true;
	speechOrFreq=true;
	$("#speech").show();
	$("#frequency").hide();
	
	$( "#tabs" ).tabs({
		activate: function( event, ui ) {
		}
	});
	
	$( "#settings" ).button({
		text: true
	})
	.click(function() {
    		$("#tabs").slideToggle("slow");
	});
	
	maxWidth= $("#svg").width(); 
	maxHeight= maxWidth;
	width = maxWidth - margin.right - margin.left;
	height = 800 - margin.top - margin.bottom;
		
	$( "#slider-range-max-width" ).slider({
		range: "max",
		min: 300,
		max: maxWidth,
		value: maxWidth,
		step:20,
		slide: function( event, ui ) {
			$( "#widthamount" ).val( ui.value );
			width=ui.value-margin.right-margin.left;
			drawTree();
		}
	});
	$( "#widthamount" ).val( $( "#slider-range-max-width" ).slider( "value" ) );
	

	$( "#slider-range-max-height" ).slider({
		range: "max",
		min: 300,
		max: maxHeight,
		value: 800,
		step:20,
		slide: function( event, ui ) {
			$( "#heightamount" ).val( ui.value );
			height=ui.value-margin.top-margin.bottom;
			drawTree();
		}
	});

	$( "#heightamount" ).val( $( "#slider-range-max-height" ).slider( "value" ) );
	
	/*
		VERB #c4bd97
		NOUN #95b3d7
		ADJ #d8d8d8
		ADV #c0504d
		IN #e5e0ec
		CC #7f7f7f
		EX #dbeef3
		PRP #fbd5b5
		WP #e36c09
		WRB #31859b
		MISC #366092

		ADJP #938953
		ADVP #17365d
		NP   #a5a5a5
		PP #632423
		S #366092
		SBAR #d60094
		SBARQ #31859b
		SINV #974806
		SQ #92d050
		VP #00b0f0
		WHADVP #7030a0
		WHNP #99ff66
		WHPP #6600ff
		OTHERS #00cc66

		WORDS #ffffff
	*/
	
	$("#mycolor1").colorpicker({
		color:getColor("VERB",speeches)
	});
	$("#mycolor2").colorpicker({
		color:getColor("NOUN",speeches)
	});
	$("#mycolor3").colorpicker({
		color:getColor("ADJ",speeches)
	});
	$("#mycolor4").colorpicker({
		color:getColor("ADV",speeches)
	});
	$("#mycolor5").colorpicker({
		color:getColor("IN",speeches)
	});
	$("#mycolor6").colorpicker({
		color:getColor("CC",speeches)
	});
	$("#mycolor7").colorpicker({
		color:getColor("EX",speeches)
	});
	$("#mycolor8").colorpicker({
		color:getColor("PRP",speeches)
	});
	$("#mycolor9").colorpicker({
		color:getColor("WP",speeches)
	});
	$("#mycolor10").colorpicker({
		color:getColor("WRB",speeches)
	});
	$("#mycolor11").colorpicker({
		color:getColor("UNKNOWN",speeches)
	});
	
	$("#mycolor1").on("change.color", function(event, color){
   		 changeColor("VERB",color,speeches);
   		 drawTree();
	});
	$("#mycolor2").on("change.color", function(event, color){
   		 changeColor("NOUN",color,speeches);
   		 drawTree();
	});
	$("#mycolor3").on("change.color", function(event, color){
   		 changeColor("ADJ",color,speeches);
   		 drawTree();
	});
	$("#mycolor4").on("change.color", function(event, color){
   		 changeColor("ADV",color,speeches);
   		 drawTree();
	});
	$("#mycolor5").on("change.color", function(event, color){
   		 changeColor("IN",color,speeches);
   		 drawTree();
	});
	$("#mycolor6").on("change.color", function(event, color){
   		 changeColor("CC",color,speeches);
   		 drawTree();
	});
	$("#mycolor7").on("change.color", function(event, color){
   		 changeColor("EX",color,speeches);
   		 drawTree();
	});
	$("#mycolor8").on("change.color", function(event, color){
   		 changeColor("PRP",color,speeches);
   		 drawTree();
	});
	$("#mycolor9").on("change.color", function(event, color){
   		 changeColor("WP",color,speeches);
   		 drawTree();
	});
	$("#mycolor10").on("change.color", function(event, color){
   		 changeColor("WRB",color,speeches);
   		 drawTree();
	});
	$("#mycolor11").on("change.color", function(event, color){
   		 changeColor("UNKNOWN",color,speeches);
   		 drawTree();
	});
	
	
	$("#mycolorf1").colorpicker({
		color:getColor2("freq1",freqs)
	});
	$("#mycolorf2").colorpicker({
		color:getColor2("freq2",freqs)
	});
	$("#mycolorf3").colorpicker({
		color:getColor2("freq3",freqs)
	});
	$("#mycolorf4").colorpicker({
		color:getColor2("freq4",freqs)
	});
	$("#mycolorf5").colorpicker({
		color:getColor2("freq5",freqs)
	});
	$("#mycolorf6").colorpicker({
		color:getColor2("freq6",freqs)
	});
	
	
	$("#mycolorf1").on("change.color", function(event, color){
   		 changeColor2("freq1",color,freqs);
   		 drawTree();
	});
	$("#mycolorf2").on("change.color", function(event, color){
   		 changeColor2("freq2",color,freqs);
   		 drawTree();
	});
	$("#mycolorf3").on("change.color", function(event, color){
   		 changeColor2("freq3",color,freqs);
   		 drawTree();
	});
	$("#mycolorf4").on("change.color", function(event, color){
   		 changeColor2("freq4",color,freqs);
   		 drawTree();
	});
	$("#mycolorf5").on("change.color", function(event, color){
   		 changeColor2("freq5",color,freqs);
   		 drawTree();
	});
	$("#mycolorf6").on("change.color", function(event, color){
   		 changeColor2("freq6",color,freqs);
   		 drawTree();
	});
	
	function getColor(speech,speeches){
		return 	speeches.filter(function (el) {
			return el.name==speech ;
		})[0].color;		
	}

	function getColor2(freq,freqs){
		return 	freqs.filter(function (el) {
			return el.name==freq ;
		})[0].color;		
	}

	function changeColor2(freq,color,freqs){

		freqs.filter(function (el) {
			return el.name==freq ;
		})[0].color=color;
		$.cookie('freqs', freqs, { expires: 20*365 });
	}

	function changeColor(speech,color,speeches){

		speeches.filter(function (el) {
			return el.name==speech ;
		})[0].color=color;
		//console.log("6"+speeches[0].name+"="+speeches[0].color);
		$.cookie('speeches', speeches, { expires: 20*365 });
	}
	
	/*
	$("#mycolorS1").colorpicker({
		color:"#938953"
	});
	$("#mycolorS2").colorpicker({
		color:"#17365d"
	});
	$("#mycolorS3").colorpicker({
		color:"#a5a5a5"
	});
	$("#mycolorS4").colorpicker({
		color:"#632423"
	});
	$("#mycolorS5").colorpicker({
		color:"#366092"
	});
	$("#mycolorS6").colorpicker({
		color:"#d60094"
	});
	$("#mycolorS7").colorpicker({
		color:"#31859b"
	});
	$("#mycolorS8").colorpicker({
		color:"#974806"
	});
	$("#mycolorS9").colorpicker({
		color:"#92d050"
	});
	$("#mycolorS10").colorpicker({
		color:"#00b0f0"
	});
	$("#mycolorS11").colorpicker({
		color:"#7030a0"
	});
	$("#mycolorS12").colorpicker({
		color:"#99ff66"
	});
	$("#mycolorS13").colorpicker({
		color:"#6600ff"
	});
	$("#mycolorS14").colorpicker({
		color:"#00cc66"
	});
	
	$("#mycolorS1").on("change.color", function(event, color){
   		 drawTree();
	});
	$("#mycolorS2").on("change.color", function(event, color){
   		 drawTree();
	});
	$("#mycolorS3").on("change.color", function(event, color){
   		 drawTree();
	});
	$("#mycolorS4").on("change.color", function(event, color){
   		 drawTree();
	});
	$("#mycolorS5").on("change.color", function(event, color){
   		 drawTree();
	});
	$("#mycolorS6").on("change.color", function(event, color){
   		 drawTree();
	});	
	$("#mycolorS7").on("change.color", function(event, color){
   		 drawTree();
	});	
	$("#mycolorS8").on("change.color", function(event, color){
   		 drawTree();
	});
	$("#mycolorS9").on("change.color", function(event, color){
   		 drawTree();
	});
	$("#mycolorS10").on("change.color", function(event, color){
   		 drawTree();
	});
	$("#mycolorS11").on("change.color", function(event, color){
   		 drawTree();
	});
	$("#mycolorS12").on("change.color", function(event, color){
   		 drawTree();
	});
	$("#mycolorS13").on("change.color", function(event, color){
   		 drawTree();
	});	
	$("#mycolorS14").on("change.color", function(event, color){
   		 drawTree();
	});
	*/
	
	$('input:radio[name="words"]').change(
    function(){
        if ($(this).val() == 'speech') {
            $("#speech").show();
            $("#frequency").hide();    
            speechOrFreq=true;  
            drawTree() 
        }
        else {
           	$("#speech").hide();
        	$("#frequency").show();
            speechOrFreq=false;  
            drawTree();          
        }
    });
	
	$('input:radio[name="treealg"]').change(
    function(){

        if ($(this).val() == 'indented') {
			indented=1;
			drawTree();
        } 
        else if($(this).val() == 'regular'){
        	indented=2;
			drawTree();
        }
        else{
         	indented=3;
			drawTree();       
        }
    });
	
	$('#checkboxPOS').change(function() {
	   if($(this).is(":checked")) {
			ifShowPosText=1;
			drawTree();
   		}
   		else{
			ifShowPosText=0;
			drawTree();
		}
	});
	
	
	//str='{"name": "","children":[{"name":"S","children":[{"name":"NP","children":[{"name":"NNP","children":[{"name":"Beauty"}]}]},{"name":"VP","children":[{"name":"VBZ","children":[{"name":"is"}]},{"name":"NP","children":[{"name":"JJ","children":[{"name":"only"}]},{"name":"NN","children":[{"name":"skin"}]}]},{"name":"ADVP","children":[{"name":"RB","children":[{"name":"deep"}]}]}]},{"name":".","children":[{"name":"."}]}]}]}';
	str=getURLParameter("tree");
	drawTree();

});

function drawTree(){

	//width=800;
	//height=800;
	if(indented==1){
		tree=d3.layout.tiltedtree().size([height-margin.top, width-margin.left]);
	}
	else if(indented==2){
		tree=d3.layout.tree().size([height-margin.top-margin.top, width-margin.left-margin.left]);
	}
	else{
		tree=d3.layout.tree().size([width-margin.left-margin.left,height-margin.top-margin.top]);
	}
	// Draw the tree horizontally, from left to right
	if(indented==3){
		diagonal = d3.svg.diagonal()
			.projection(function(d) { return [d.x, d.y]; });
	}
	else{
		diagonal = d3.svg.diagonal()
			.projection(function(d) { return [d.y, d.x]; });
	}
	
	d3.select("body").select("#svg").select("svg").remove();
	svg=d3.select("body").select("#svg").append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//d3.select(self.frameElement).style("height", "800px");

	root=JSON.parse(str);
	root.x0 = height / 2;
	root.y0 = 0;
  
  	var nodes = tree.nodes(root);
  
	var tmp;
	nodes.forEach(function(d, i) {
		if((!d.children)&&(!d._children)){
			tmp=d.parent;
			tmp.wordName=d.name;
			tmp.children=null;	
			tmp._children=null;		
		}
	});

	// Draw the graph
	update(root);
}

/*
VERB #c4bd97
NOUN #95b3d7
ADJ #d8d8d8
ADV #c0504d
IN #e5e0ec
CC #7f7f7f
EX #dbeef3
PRP #fbd5b5
WP #e36c09
WRB #31859b
MISC #366092

ADJP #938953
ADVP #17365d
NP   #a5a5a5
PP #632423
S #366092
SBAR #d60094
SBARQ #31859b
SINV #974806
SQ #92d050
VP #00b0f0
WHADVP #7030a0
WHNP #99ff66
WHPP #6600ff
OTHERS #00cc66

WORDS #ffffff
*/


function addColor(nodes){
	var i;
	for(i=0;i<nodes.length;i++){
		/*
		if(nodes[i].children==undefined){
			nodes[i].color="#ffffff";
		}
		else if(nodes[i].children[0].children==undefined){
			switch (nodes[i].name) {
 				
 				case "VERB":
				case "VB":
				case "VBD":
				case "VBG":
				case "VBN":
				case "VBP":
				case "VBZ":
					nodes[i].color= $("#mycolor1").colorpicker("val");
    				break;
				case "NOUN":
				case "NN":
				case "NNS":
				case "NNP":
				case "NNPS":
					nodes[i].color= $("#mycolor2").colorpicker("val");
    				break;
    			case "ADJ":
    			case "JJ":
    			case "JJR":
    			case "JJS":
					nodes[i].color= $("#mycolor3").colorpicker("val");
    				break;
    			case "ADV":
    			case "RB":
    			case "RBR":
    			case "RBS":
					nodes[i].color= $("#mycolor4").colorpicker("val");
    				break;
				case "IN":
					nodes[i].color= $("#mycolor5").colorpicker("val");
    				break;
				case "CC":
					nodes[i].color= $("#mycolor6").colorpicker("val");
    				break;
    			case "EX":
					nodes[i].color= $("#mycolor7").colorpicker("val");
    				break;
    			case "PRP":
    			case "PP$":
					nodes[i].color= $("#mycolor8").colorpicker("val");
    				break;
    			case "WP":
    			case "WDT":
    			case "WP$":
					nodes[i].color= $("#mycolor9").colorpicker("val");
    				break;
    			case "WRB":
					nodes[i].color= $("#mycolor10").colorpicker("val");
					break;
  				default:
    				nodes[i].color= $("#mycolor11").colorpicker("val");
			}
		}
		*/
		if(nodes[i].children==undefined){
			switch (nodes[i].name) {
 				
 				case "VERB":
				case "VB":
				case "VBD":
				case "VBG":
				case "VBN":
				case "VBP":
				case "VBZ":
					nodes[i].color= $("#mycolor1").colorpicker("val");
    				break;
				case "NOUN":
				case "NN":
				case "NNS":
				case "NNP":
				case "NNPS":
					nodes[i].color= $("#mycolor2").colorpicker("val");
    				break;
    			case "ADJ":
    			case "JJ":
    			case "JJR":
    			case "JJS":
					nodes[i].color= $("#mycolor3").colorpicker("val");
    				break;
    			case "ADV":
    			case "RB":
    			case "RBR":
    			case "RBS":
					nodes[i].color= $("#mycolor4").colorpicker("val");
    				break;
				case "IN":
					nodes[i].color= $("#mycolor5").colorpicker("val");
    				break;
				case "CC":
					nodes[i].color= $("#mycolor6").colorpicker("val");
    				break;
    			case "EX":
					nodes[i].color= $("#mycolor7").colorpicker("val");
    				break;
    			case "PRP":
    			case "PP$":
					nodes[i].color= $("#mycolor8").colorpicker("val");
    				break;
    			case "WP":
    			case "WDT":
    			case "WP$":
					nodes[i].color= $("#mycolor9").colorpicker("val");
    				break;
    			case "WRB":
					nodes[i].color= $("#mycolor10").colorpicker("val");
					break;
  				default:
    				nodes[i].color= $("#mycolor11").colorpicker("val");
			}
		}
		else{
			nodes[i].color="#fff";
		}
		/*
		else {
			switch (nodes[i].name) {
				case "ADJP":
					nodes[i].color= $("#mycolorS1").colorpicker("val");
					break;
				case "ADVP":
					nodes[i].color= $("#mycolorS2").colorpicker("val");
					break;
				case "NP":
					nodes[i].color= $("#mycolorS3").colorpicker("val");
					break;
				case "PP":
					nodes[i].color= $("#mycolorS4").colorpicker("val");
					break;
				case "S":
					nodes[i].color= $("#mycolorS5").colorpicker("val");
					break;
				case "SBAR":
					nodes[i].color= $("#mycolorS6").colorpicker("val");
					break;
				case "SBARQ":
					nodes[i].color= $("#mycolorS7").colorpicker("val");
					break;
				case "SINV":
					nodes[i].color= $("#mycolorS8").colorpicker("val");
					break;
				case "SQ":
					nodes[i].color= $("#mycolorS9").colorpicker("val");
					break;
				case "VP":
					nodes[i].color= $("#mycolorS10").colorpicker("val");
					break;
				case "WHADVP":
					nodes[i].color= $("#mycolorS11").colorpicker("val");
					break;
				case "WHNP":
					nodes[i].color= $("#mycolorS12").colorpicker("val");
					break;
				case "WHPP":
					nodes[i].color= $("#mycolorS13").colorpicker("val");
					break;
  				default:
    				nodes[i].color= $("#mycolorS14").colorpicker("val");
			}
		}*/
	}	
}

// Recalculate node positions
function update(source) {

	// Compute the new tree layout.
	// Note that all the nodes are expanded here.
	var nodes = tree.nodes(root),
		links = tree.links(nodes);

	addColor(nodes);

	nodes.forEach(function(d, i) {
	 	if(ifShowPosText==1){
			if((!d.children)&&(!d._children)){
			 	d._name = d.wordName+" "+d.name;
			}
			else{
				d._name=d.name;
			} 
		}
		else{
			if((!d.children)&&(!d._children)){
				d._name=d.wordName;
			}
			else {
				d._name="";
			}
		}
	});
	
	var cont=1;
	while(cont==1){
		cont=0;
		links.forEach(function(d,i){
			if((d.target.name==".")){
				 links.splice(i, 1);
				 cont=1;
			}
			else if((d.target.name==",")){
				 links.splice(i, 1);
				 cont=1;
			}
		});
	}
 	
	// Update the nodes
	// Assign each node an id. These ids are used for D3 generate update pattern.
  	var node = svg.selectAll("g.node")
    	.data(nodes, function(d) { return d.id || (d.id = ++i); });

	// Enter any new nodes at the parent's previous position, but don't draw them yet. 
  	
  	if(indented==3){
		  var nodeEnter = node.enter().append("g")
    	.attr("class", "node")
    	.attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
    	.on("click", click);
	}
	else{
		  var nodeEnter = node.enter().append("g")
    	.attr("class", "node")
    	.attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
    	.on("click", click);
	}


  	// Display collapsed nodes as filled circles, and expanded nodes as hollow circles. 
	nodeEnter.append("circle")
		.attr("r", 1e-6) // But don't display the circle yet
		.style("fill", function(d) { return d._children ? "lightsteelblue" : d.color; });

  	// If the node is collapsed, display the concatenated string of this and all child nodes.
  	// If the node is expanded, display only the name for this node. 
  	var generateLabel = function(d) { 
							if(d._children) { // If the node is collapsed
								var name_collapsed_node = d._name + " ";
		 
								// Concatenate strings from the child nodes 
								function getName(d) {
									name_collapsed_node += d._name + " ";
									if(d.children) 
										d.children.forEach(getName);
									else if(d._children)
										d._children.forEach(getName);
								}
			
								d._children.forEach(getName);
								// Display the (long) concatenated string of this and all child nodes
								// when the node is collapsed. 
								return name_collapsed_node;
							 } else {
								// Display the (short) original name when the node is 
								// expanded. 
								return d._name; 
							 }
						}
					
	// Create the label for each new node.  
	// Note that the node that is clicked on is not a new node, therefore
	// the text for the clicked node is not updated here. 
	nodeEnter.append("text")
		.attr("x", function(d) { return 6; })
		.attr("y", function(d) { return -11; })
		.attr("dy", ".35em")
		.attr("text-anchor", function(d) { return "start"; })
		.text(generateLabel)
		.style("fill-opacity", 1e-6); // Don't display the text yet. 

  	// Add tooltip for each node	  
  	nodeEnter.append("svg:title");	  
  
	// Transition nodes to their new position, creating the animation effect.
	if(indented==3){
	 	var nodeUpdate = node.transition()
    	.duration(duration)
      	.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	}
	else{
		var nodeUpdate = node.transition()
			.duration(duration)
			.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
	}
 
	// Now draw the all the circles (old and new) after the transition or animation.  
	nodeUpdate.select("circle")
		.attr("r", 7.5)
		.style("fill", function(d) { return d._children ? "lightsteelblue" : d.color; });

	// Now draw all the texts (old and new) after the transition or animation.
	// The text of the node that is clicked on is updated here. 
	// If the node is expanded, then display the short label (it's original name). 
	// If the node is collapsed, then display the long label 
	nodeUpdate.select("text")
		.style("fill-opacity", 1)
		.text(generateLabel);

	// Update tooltip text for each node	  
	nodeUpdate.select("title").text(generateLabel);

	// Transition exiting nodes to the parent's new position.
	if(indented==3){
		var nodeExit = node.exit().transition()
		.duration(duration)
		.attr("transform", function(d) { return "translate(" + source.x + "," + source.y + ")"; })
		.remove();
	}
	else{
		var nodeExit = node.exit().transition()
			.duration(duration)
			.attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
			.remove();
	}

	nodeExit.select("circle")
		.attr("r", 1e-6);

	nodeExit.select("text")
		.style("fill-opacity", 1e-6);

	// Update the links
	var link = svg.selectAll("path.link")
		.data(links, function(d) { return d.target.id; });

	// Enter any new links at the parent's previous position.
	link.enter().insert("path", "g")
		.attr("class", "link")
		.attr("d", function(d) {
        				var o = {x: source.x0, y: source.y0};
        				return diagonal({source: o, target: o});
        			}
    );

	// Transition links to their new position.
	link.transition()
		.duration(duration)
		.attr("d", diagonal);

	// Transition exiting links to the parent's new position.
	link.exit().transition()
		.duration(duration)
		.attr("d", function(d) {
        				var o = {x: source.x, y: source.y};
        				return diagonal({source: o, target: o});
      				}
      	)
    	.remove();

	// Stash the old positions for transition.
	nodes.forEach(function(d) {
						d.x0 = d.x;
						d.y0 = d.y;
						}
	);
}  // End of update

// Toggle children on click.
function click(d) {
	if (d.children) {
    	// If the node is expanded, then collapse it. 
		// Hide all the children in d._children. 
    	d._children = d.children;  
		// Pretend there is no child. 
    	d.children = null;
	} else {
    	// If the node is collapsed, then expand it. 
		// Restore all the children to d.children. 
    	d.children = d._children; 
    	d._children = null;
	}
	// Recalculate the location of node d, its parent, and its children. 
  	update(d);
}

// This function is used to extract the parsed sentence from the passed html parameter.
function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}
