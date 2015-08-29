function startControls(){
	
	//Tabs
	$( "#tabs" ).tabs({
		activate: function( event, ui ) {
			//alert(ui.newTab.text());
			if(ui.newTab.text()=="Articles"){
				d3.select("#toolbar").style({display:"block"});
			}
			else{
				d3.select("#toolbar").style({display:"none"});
			}
		}
	});
	
	//Tool tip
	/*
	$( document ).tooltip({
		track: true
	});
	*/
	
	//Accordion
	var icons = {
	header: "ui-icon-circle-arrow-e",
	activeHeader: "ui-icon-circle-arrow-s"
	};
	
	$( "#accordion" ).accordion({
		icons: icons,
		heightStyle:"fill"
	});
	
	$( "#accordionA" ).accordion({
		icons: null,
		heightStyle:"fill"
	});
	
	//Button
	$( "#beginning" ).button({
		text: false,
		icons: {
			primary: "ui-icon-seek-start"
		}
	})
	.click(function() {
		if(currentPages==(totalPages-1)){
			$("#forward" ).button("enable");
			$( "#end" ).button("enable");
		}
		changeCurrentPage(0);
		$("#beginning" ).button("disable");
		$( "#rewind" ).button("disable");
		$.post('/NLPVis/logServlet','code=a11',function(){
		});
	});

	$( "#rewind" ).button({
		text: false,
		icons: {
			primary: "ui-icon-seek-prev"
		}
	})
	.click(function() {
		if(currentPages==(totalPages-1)){
			$("#forward" ).button("enable");
			$( "#end" ).button("enable");
		}
		changeCurrentPage(currentPages-1);
		if(currentPages==0){
			$("#beginning" ).button("disable");
			$( "#rewind" ).button("disable");
		}
		$.post('/NLPVis/logServlet','code=a12',function(){
		});
	});
	
	
	 $( "#forward" ).button({
		text: false,
		icons: {
			primary: "ui-icon-seek-next"
		}
	})
	.click(function() {
		if(currentPages==0){
			$("#beginning" ).button("enable");
			$( "#rewind" ).button("enable");
		}
		changeCurrentPage(currentPages+1);
		if(currentPages==(totalPages-1)){
			$("#forward" ).button("disable");
			$( "#end" ).button("disable");
		}
		$.post('/NLPVis/logServlet','code=a13',function(){
		});
	});
	
	
	$( "#end" ).button({
		text: false,
		icons: {
		primary: "ui-icon-seek-end"
		}
	})
	.click(function() {
		if(currentPages==0){
			$("#beginning" ).button("enable");
			$( "#rewind" ).button("enable");
		}
		changeCurrentPage((totalPages-1));
		$("#forward" ).button("disable");
		$( "#end" ).button("disable");
		$.post('/NLPVis/logServlet','code=a14',function(){
		});
	});
			
	$( "#search" ).button({
		text: true
	})
	.click(function() {

		var page=Number(d3.select("#inputpages").property("value"));
		//alert(page);
		if((page<1)||(page>totalPages)){
			d3.select("#dialog").html("<p>Please input a number between 1 and "+totalPages.toString()+". ");
			 $(function() {
				$( "#dialog" ).dialog();
			 });
			 d3.select("#inputpages").property("value",(currentPages+1).toString());
		}
		else{
			if(currentPages==0){
				$("#beginning" ).button("enable");
				$( "#rewind" ).button("enable");
			}
			else if(currentPages==(totalPages-1)){
				$("#forward" ).button("enable");
				$( "#end" ).button("enable");
			}
			changeCurrentPage(page-1);
			if(currentPages==(totalPages-1)){
				$("#forward" ).button("disable");
				$( "#end" ).button("disable");
			}
			if(currentPages==0){
				$("#beginning" ).button("disable");
				$( "#rewind" ).button("disable");
			}
		}
	});
	
	//Progress Bar
	var progressbar = $( "#progressbar" ),
	progressLabel = $( ".progress-label" );
	progressbar.progressbar({
		value: false,
		create: function(){
			$('#pagewrapper').hide();
		},
		change: function() {
			//progressLabel.text( progressbar.progressbar( "value" ) + "%" );
		},
		complete: function() {
			progressLabel.text( "Complete!" );
			progressbar.hide();
			$('#pagewrapper').show();
		}
	});

	function progress() {
		console.log("value="+progressbar.progressbar("value"));
		var val = progressbar.progressbar( "value" ) || 0;
		console.log("val="+progressbar.progressbar("value"));
		progressbar.progressbar( "value", val + 2 );
		if ( val < 150 ) {
			setTimeout( progress, 80 );
		}
	}
	//setTimeout( progress, 2000 );
	
	//$( "#radio" ).buttonset();
	
	$('input:radio[name="words"]').change(
    function(){
        if ($(this).val() == 'speech') {
            $("#speech").show();
            $("#frequency").hide();    
            speechOrFreq=true;   
            refresh();     
        }
        else {
           	$("#speech").hide();
        	$("#frequency").show();
            speechOrFreq=false;            
        	refresh();
        }
    });
    
    
     dialog1 = $( "#append_dialog" ).dialog({
		autoOpen: false,
		height: 600,
		width: 800,
		modal: true,
		buttons: {
			"Append": appendArticle,
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
		appendArticle();
	});
    
         
    dialog2 = $( "#import_dialog" ).dialog({
		autoOpen: false,
		height: 300,
		width: 800,
		modal: true,
		buttons: {
			"Import": importArticle,
			Cancel: function() {
				dialog2.dialog( "close" );
			}
		},
		close: function() {
			form1[ 0 ].reset();
			//allFields.removeClass( "ui-state-error" );
		}
	});
	
	 form1 = dialog2.find( "form" ).on( "submit", function( event ) {
		event.preventDefault();
		importArticle();
	});
		
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
freq1 #c4bd97
freq2 #95b3d7
freq3 #d8d8d8
freq4 #c0504d
freq5 #e5e0ec
freq6 #7f7f7f
*/

function newColorPicker(speeches,freqs){

    
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
	});
	$("#mycolor2").on("change.color", function(event, color){
   		 changeColor("NOUN",color,speeches);
	});
	$("#mycolor3").on("change.color", function(event, color){
   		 changeColor("ADJ",color,speeches);
	});
	$("#mycolor4").on("change.color", function(event, color){
   		 changeColor("ADV",color,speeches);
	});
	$("#mycolor5").on("change.color", function(event, color){
   		 changeColor("IN",color,speeches);
	});
	$("#mycolor6").on("change.color", function(event, color){
   		 changeColor("CC",color,speeches);
	});
	$("#mycolor7").on("change.color", function(event, color){
   		 changeColor("EX",color,speeches);
	});
	$("#mycolor8").on("change.color", function(event, color){
   		 changeColor("PRP",color,speeches);
	});
	$("#mycolor9").on("change.color", function(event, color){
   		 changeColor("WP",color,speeches);
	});
	$("#mycolor10").on("change.color", function(event, color){
   		 changeColor("WRB",color,speeches);
	});
	$("#mycolor11").on("change.color", function(event, color){
   		 changeColor("UNKNOWN",color,speeches);
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
	});
	$("#mycolorf2").on("change.color", function(event, color){
   		 changeColor2("freq2",color,freqs);
	});
	$("#mycolorf3").on("change.color", function(event, color){
   		 changeColor2("freq3",color,freqs);
	});
	$("#mycolorf4").on("change.color", function(event, color){
   		 changeColor2("freq4",color,freqs);
	});
	$("#mycolorf5").on("change.color", function(event, color){
   		 changeColor2("freq5",color,freqs);
	});
	$("#mycolorf6").on("change.color", function(event, color){
   		 changeColor2("freq6",color,freqs);
	});

}
function getColor(speech,speeches){
	//console.log("5"+speeches[0].name+"="+speeches[0].color);
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
	refresh();
}

function changeColor(speech,color,speeches){

	speeches.filter(function (el) {
		return el.name==speech ;
	})[0].color=color;
	//console.log("6"+speeches[0].name+"="+speeches[0].color);
	$.cookie('speeches', speeches, { expires: 20*365 });
	refresh();
}

// Initiate the system from local files
// Just for the test purpose.
//init("matching.json","corpusStatistics.json","articlesStatistics.json","corpusStr.json","corpusTxt.json");
function init(file1,file2,file3,file4,file5){
	d3.json(file1, function(error, txt) {
		matching=txt;
		//console.log(matching[2].name);
		d3.json(file2, function(error, txt) {
			corpusStatistics=txt;
			totalNum=txt.articles;
			totalPages=txt.totalPages;
			//console.log(corpusStatistics);
			d3.json(file3, function(error, txt) {
				articlesStatistics=txt;
				//console.log(articlesStatistics[3].name);
				d3.json(file4, function(error, txt) {
					corpusStr=txt;
					//console.log(corpusStr[3].name);
					d3.json(file5, function(error, txt) {
						//console.log(error);
						corpusTxt=txt;
						//console.log(corpusTxt[2].content);
						gStratistics="<p>"+"Corpus Name: "+ corpusStatistics.corpus+ "</p>";
						gStratistics=gStratistics+"<p>"+"# of Articles: "+ corpusStatistics.articles+ "</p>";
						gStratistics=gStratistics+"<p>"+"# of Sentences: "+ corpusStatistics.sentences+ "</p>";
						gStratistics=gStratistics+"<p>"+"# of Words: "+ corpusStatistics.words+ "</p>";
						gStratistics=gStratistics+"<hr/>";
						loadTab1();
						loadCorr1();
						loadCorr2();
						loadCorr3();
						updateCorr3(currentPages);
						d3.select("#inputpages").property("value",1);
						d3.select("#title1").text(space[currentPos]);		
						d3.select("#title2").text("Statistics("+space[currentPos]+")");	
						d3.select("#background0").style("fill",colorActive);
						d3.select("#background1").style("fill",colorInactive);
						d3.select("#background2").style("fill",colorInactive);
						d3.select("#background3").style("fill",colorInactive);	
					});
				});
			});
		});
	});
}

function colorPicker(speeches,freqs){

	//VERB, NOUN, ADJ, ADV, IN, CC, EX, PRP, WP, WRB, UNKNOWN
	$("#CVERB").spectrum({
		color: speeches.filter(function (el) {
 		 return el.name=="VERB" ;})[0].color,
		showInput: true,
		className: "full-spectrum",
		showInitial: true,
		showPalette: true,
		showSelectionPalette: true,
		maxPaletteSize: 10,
		preferredFormat: "hex",
		localStorageKey: "spectrum.demo",
		move: function (color) {
		
		},
		show: function () {
	
		},
		beforeShow: function () {
	
		},
		hide: function () {
	
		},
		change: function(color) {
			speeches.filter(function (el) {
				return el.name=="VERB" ;
			})[0].color=color;
		},
		palette: [
			["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
			"rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
			["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
			"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
			["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
			"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
			"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
			"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
			"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
			"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
			"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
			"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
			"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
			"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
		]
	});
	$("#CNOUN").spectrum({
		color: speeches.filter(function (el) {
 		 return el.name=="NOUN" ;})[0].color,
 		showInput: true,
		className: "full-spectrum",
		showInitial: true,
		showPalette: true,
		showSelectionPalette: true,
		maxPaletteSize: 10,
		preferredFormat: "hex",
		localStorageKey: "spectrum.demo",
		move: function (color) {
		
		},
		show: function () {
	
		},
		beforeShow: function () {
	
		},
		hide: function () {
	
		},
		change: function(color) {
			speeches.filter(function (el) {
				return el.name=="NOUN" ;
			})[0].color=color;
		},
		palette: [
			["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
			"rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
			["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
			"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
			["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
			"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
			"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
			"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
			"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
			"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
			"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
			"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
			"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
			"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
		]
	});
	$("#CADJ").spectrum({
		color: speeches.filter(function (el) {
 		 return el.name=="ADJ" ;})[0].color,
 		showInput: true,
		className: "full-spectrum",
		showInitial: true,
		showPalette: true,
		showSelectionPalette: true,
		maxPaletteSize: 10,
		preferredFormat: "hex",
		localStorageKey: "spectrum.demo",
		move: function (color) {
		
		},
		show: function () {
	
		},
		beforeShow: function () {
	
		},
		hide: function () {
	
		},
		change: function(color) {
			speeches.filter(function (el) {
				return el.name=="ADJ" ;
			})[0].color=color;
		},
		palette: [
			["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
			"rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
			["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
			"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
			["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
			"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
			"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
			"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
			"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
			"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
			"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
			"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
			"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
			"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
		]
	});
	$("#CADV").spectrum({
		color: speeches.filter(function (el) {
 		 return el.name=="ADV" ;})[0].color,
 		showInput: true,
		className: "full-spectrum",
		showInitial: true,
		showPalette: true,
		showSelectionPalette: true,
		maxPaletteSize: 10,
		preferredFormat: "hex",
		localStorageKey: "spectrum.demo",
		move: function (color) {
		
		},
		show: function () {
	
		},
		beforeShow: function () {
	
		},
		hide: function () {
	
		},
		change: function(color) {
			speeches.filter(function (el) {
				return el.name=="ADV" ;
			})[0].color=color;
		},
		palette: [
			["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
			"rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
			["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
			"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
			["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
			"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
			"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
			"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
			"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
			"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
			"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
			"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
			"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
			"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
		]
	});
	$("#CIN").spectrum({
		color: speeches.filter(function (el) {
 		 return el.name=="IN" ;})[0].color,
 		showInput: true,
		className: "full-spectrum",
		showInitial: true,
		showPalette: true,
		showSelectionPalette: true,
		maxPaletteSize: 10,
		preferredFormat: "hex",
		localStorageKey: "spectrum.demo",
		move: function (color) {
		
		},
		show: function () {
	
		},
		beforeShow: function () {
	
		},
		hide: function () {
	
		},
		change: function(color) {
			speeches.filter(function (el) {
				return el.name=="IN" ;
			})[0].color=color;
		},
		palette: [
			["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
			"rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
			["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
			"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
			["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
			"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
			"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
			"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
			"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
			"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
			"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
			"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
			"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
			"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
		]
	});
	$("#CCC").spectrum({
		color: speeches.filter(function (el) {
 		 return el.name=="CC" ;})[0].color,
 		showInput: true,
		className: "full-spectrum",
		showInitial: true,
		showPalette: true,
		showSelectionPalette: true,
		maxPaletteSize: 10,
		preferredFormat: "hex",
		localStorageKey: "spectrum.demo",
		move: function (color) {
		
		},
		show: function () {
	
		},
		beforeShow: function () {
	
		},
		hide: function () {
	
		},
		change: function(color) {
			speeches.filter(function (el) {
				return el.name=="CC" ;
			})[0].color=color;
		},
		palette: [
			["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
			"rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
			["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
			"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
			["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
			"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
			"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
			"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
			"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
			"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
			"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
			"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
			"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
			"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
		]
	});
	$("#CEX").spectrum({
		color: speeches.filter(function (el) {
 		 return el.name=="EX" ;})[0].color,
 		showInput: true,
		className: "full-spectrum",
		showInitial: true,
		showPalette: true,
		showSelectionPalette: true,
		maxPaletteSize: 10,
		preferredFormat: "hex",
		localStorageKey: "spectrum.demo",
		move: function (color) {
		
		},
		show: function () {
	
		},
		beforeShow: function () {
	
		},
		hide: function () {
	
		},
		change: function(color) {
			speeches.filter(function (el) {
				return el.name=="EX" ;
			})[0].color=color;
		},
		palette: [
			["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
			"rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
			["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
			"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
			["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
			"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
			"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
			"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
			"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
			"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
			"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
			"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
			"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
			"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
		]
	});
	$("#CPRP").spectrum({
		color: speeches.filter(function (el) {
 		 return el.name=="PRP" ;})[0].color,
 		showInput: true,
		className: "full-spectrum",
		showInitial: true,
		showPalette: true,
		showSelectionPalette: true,
		maxPaletteSize: 10,
		preferredFormat: "hex",
		localStorageKey: "spectrum.demo",
		move: function (color) {
		
		},
		show: function () {
	
		},
		beforeShow: function () {
	
		},
		hide: function () {
	
		},
		change: function(color) {
			speeches.filter(function (el) {
				return el.name=="PRP" ;
			})[0].color=color;
		},
		palette: [
			["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
			"rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
			["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
			"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
			["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
			"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
			"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
			"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
			"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
			"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
			"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
			"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
			"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
			"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
		]
	});
	$("#CWP").spectrum({
		color: speeches.filter(function (el) {
 		 return el.name=="WP" ;})[0].color,
 		showInput: true,
		className: "full-spectrum",
		showInitial: true,
		showPalette: true,
		showSelectionPalette: true,
		maxPaletteSize: 10,
		preferredFormat: "hex",
		localStorageKey: "spectrum.demo",
		move: function (color) {
		
		},
		show: function () {
	
		},
		beforeShow: function () {
	
		},
		hide: function () {
	
		},
		change: function(color) {
			speeches.filter(function (el) {
				return el.name=="WP" ;
			})[0].color=color;
		},
		palette: [
			["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
			"rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
			["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
			"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
			["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
			"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
			"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
			"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
			"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
			"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
			"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
			"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
			"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
			"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
		]
	});
	$("#CWRB").spectrum({
		color: speeches.filter(function (el) {
 		 return el.name=="WRB" ;})[0].color,
 		showInput: true,
		className: "full-spectrum",
		showInitial: true,
		showPalette: true,
		showSelectionPalette: true,
		maxPaletteSize: 10,
		preferredFormat: "hex",
		localStorageKey: "spectrum.demo",
		move: function (color) {
		
		},
		show: function () {
	
		},
		beforeShow: function () {
	
		},
		hide: function () {
	
		},
		change: function(color) {
			speeches.filter(function (el) {
				return el.name=="WRB" ;
			})[0].color=color;
		},
		palette: [
			["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
			"rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
			["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
			"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
			["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
			"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
			"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
			"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
			"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
			"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
			"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
			"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
			"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
			"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
		]
	});
	$("#CUNKNOWN").spectrum({
		color: speeches.filter(function (el) {
 		 return el.name=="UNKNOWN" ;})[0].color,
 		showInput: true,
		className: "full-spectrum",
		showInitial: true,
		showPalette: true,
		showSelectionPalette: true,
		maxPaletteSize: 10,
		preferredFormat: "hex",
		localStorageKey: "spectrum.demo",
		move: function (color) {
		
		},
		show: function () {
	
		},
		beforeShow: function () {
	
		},
		hide: function () {
	
		},
		change: function(color) {
			speeches.filter(function (el) {
				return el.name=="UNKNOWN" ;
			})[0].color=color;
		},
		palette: [
			["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
			"rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
			["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
			"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
			["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
			"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
			"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
			"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
			"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
			"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
			"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
			"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
			"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
			"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
		]
	});

	$("#freq1").spectrum({
		color: freqs.filter(function (el) {
 		 return el.name=="freq1" ;})[0].color,
 		showInput: true,
		className: "full-spectrum",
		showInitial: true,
		showPalette: true,
		showSelectionPalette: true,
		maxPaletteSize: 10,
		preferredFormat: "hex",
		localStorageKey: "spectrum.demo",
		move: function (color) {
		
		},
		show: function () {
	
		},
		beforeShow: function () {
	
		},
		hide: function () {
	
		},
		change: function(color) {
			speeches.filter(function (el) {
				return el.name=="freq1" ;
			})[0].color=color;
		},
		palette: [
			["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
			"rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
			["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
			"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
			["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
			"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
			"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
			"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
			"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
			"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
			"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
			"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
			"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
			"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
		]
	});
	$("#freq2").spectrum({
		color: freqs.filter(function (el) {
 		 return el.name=="freq2" ;})[0].color,
 		showInput: true,
		className: "full-spectrum",
		showInitial: true,
		showPalette: true,
		showSelectionPalette: true,
		maxPaletteSize: 10,
		preferredFormat: "hex",
		localStorageKey: "spectrum.demo",
		move: function (color) {
		
		},
		show: function () {
	
		},
		beforeShow: function () {
	
		},
		hide: function () {
	
		},
		change: function(color) {
			speeches.filter(function (el) {
				return el.name=="freq2" ;
			})[0].color=color;
		},
		palette: [
			["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
			"rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
			["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
			"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
			["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
			"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
			"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
			"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
			"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
			"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
			"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
			"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
			"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
			"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
		]
	});
	$("#freq3").spectrum({
		color: freqs.filter(function (el) {
 		 return el.name=="freq3" ;})[0].color,
 		showInput: true,
		className: "full-spectrum",
		showInitial: true,
		showPalette: true,
		showSelectionPalette: true,
		maxPaletteSize: 10,
		preferredFormat: "hex",
		localStorageKey: "spectrum.demo",
		move: function (color) {
		
		},
		show: function () {
	
		},
		beforeShow: function () {
	
		},
		hide: function () {
	
		},
		change: function(color) {
			speeches.filter(function (el) {
				return el.name=="freq3" ;
			})[0].color=color;
		},
		palette: [
			["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
			"rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
			["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
			"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
			["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
			"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
			"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
			"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
			"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
			"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
			"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
			"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
			"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
			"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
		]
	});
	$("#freq4").spectrum({
		color: freqs.filter(function (el) {
 		 return el.name=="freq4" ;})[0].color,
 		showInput: true,
		className: "full-spectrum",
		showInitial: true,
		showPalette: true,
		showSelectionPalette: true,
		maxPaletteSize: 10,
		preferredFormat: "hex",
		localStorageKey: "spectrum.demo",
		move: function (color) {
		
		},
		show: function () {
	
		},
		beforeShow: function () {
	
		},
		hide: function () {
	
		},
		change: function(color) {
			speeches.filter(function (el) {
				return el.name=="freq4" ;
			})[0].color=color;
		},
		palette: [
			["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
			"rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
			["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
			"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
			["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
			"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
			"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
			"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
			"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
			"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
			"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
			"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
			"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
			"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
		]
	});
	$("#freq5").spectrum({
		color: freqs.filter(function (el) {
 		 return el.name=="freq5" ;})[0].color,
 		showInput: true,
		className: "full-spectrum",
		showInitial: true,
		showPalette: true,
		showSelectionPalette: true,
		maxPaletteSize: 10,
		preferredFormat: "hex",
		localStorageKey: "spectrum.demo",
		move: function (color) {
		
		},
		show: function () {
	
		},
		beforeShow: function () {
	
		},
		hide: function () {
	
		},
		change: function(color) {
			speeches.filter(function (el) {
				return el.name=="freq5" ;
			})[0].color=color;
		},
		palette: [
			["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
			"rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
			["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
			"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
			["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
			"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
			"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
			"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
			"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
			"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
			"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
			"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
			"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
			"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
		]
	});
	$("#freq6").spectrum({
		color: freqs.filter(function (el) {
 		 return el.name=="freq6" ;})[0].color,
 		showInput: true,
		className: "full-spectrum",
		showInitial: true,
		showPalette: true,
		showSelectionPalette: true,
		maxPaletteSize: 10,
		preferredFormat: "hex",
		localStorageKey: "spectrum.demo",
		move: function (color) {
		
		},
		show: function () {
	
		},
		beforeShow: function () {
	
		},
		hide: function () {
	
		},
		change: function(color) {
			speeches.filter(function (el) {
				return el.name=="freq6" ;
			})[0].color=color;
		},
		palette: [
			["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
			"rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
			["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
			"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
			["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
			"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
			"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
			"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
			"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
			"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
			"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
			"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
			"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
			"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
		]
	});
}

function myfunction1(){
	if(col_status==1){
		return;
	}
	else if(col_status==2){
		$("#tabs").width(col2_width+"%");
		$("#content").hide();
		$("#tabs").show();
		$("#showArticle").width(col1_width+col3_width+"%");	
	}
	else if(col_status==3){
		$("#tabs").width(col2_width+"%");
		$("#content").hide();
		$("#showArticle").width(col1_width+col3_width+"%");	
	}
	col_status=1;
};

function myfunction2(){
	if(col_status==2){
		return;
	}
	else if(col_status==1){
		$("#content").width(col3_width+"%");
		$("#content").show();
		$("#tabs").hide();
		$("#showArticle").width((col1_width+col2_width)+"%");	
	}
	else if(col_status==3){
		$("#content").width(col3_width+"%");
		$("#tabs").hide();
		$("#showArticle").width((col1_width+col2_width)+"%");	
	}
	col_status=2;
}

function myfunction3(){
	if(col_status==3){
		return;
	}
	else if(col_status==1){
		$("#showArticle").width(col1_width+"%");	
		$("#content").width(col3_width+"%");
		$("#content").show();
	}
	else if(col_status==2){
		$("#showArticle").width(col1_width+"%");	
		$("#tabs").width(col2_width+"%");
		$("#tabs").show();
	}
	col_status=3;
}

