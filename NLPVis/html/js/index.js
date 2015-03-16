// global variables
var barHeight = 20;
var duration = 250;
var delay = 25;
var margin = {top: 30, right: 10, bottom: 0, left: 20};
var color = d3.scale.ordinal().range(["steelblue", "#ccc"]);
var colorNew = d3.scale.ordinal().range(["steelblue", "steelblue"]);
var partition = d3.layout.partition();
partition.sort(null);
var coloredArea=d3.select("#article");
var depth=2;
var colorActive="#EBE6DD";
var colorInactive="#F7F6F5";
var colorSelected="blue";
var colorUnselected="black";
var atree= new Array(4);
var isResized=false;

// current pages.
var currentPages=0;
// the active pos in the current page
var currentPos=0;
var totalNum;
var totalPages;
var corpusStatistics;
var articlesStatistics;
var matching;
var corpusTxt;
var corpusStr;
var corpusNameSet;
var currentCorpus=null;
var gStratistics="";
var startPos;
var endPos;
var space=["Nil","Nil","Nil","Nil"];
var str;
var svgHeight;

// width of three columns
var col1_width;
var col2_width;
var col3_width;
var col_status;
var width_a11;
var width_a12;
var width_a21;
var width_a22;

// to-be-colored text
var txt;
var wrd;

var speechOrFreq;
var speeches;
var freqs;


	
$(document).ready(function() {                 
	
	currentCorpus="toefl";
	width_a11=$("#a11").width();
	width_a12=$("#a12").width();
	width_a21=$("#a21").width();
	width_a22=$("#a22").width();
	computeHeight();
	startControls();
	//alert("come here");	
	init_servlet();
	//alert("currentPages= "+currentPages);
	//alert("(totalPages-1)= "+(totalPages-1));
	if(currentPages==(totalPages-1)){
		$("#forward" ).button("disable");
		$( "#end" ).button("disable");
		$("#forward" ).button("disable");
		$( "#end" ).button("disable");
	}
	col_status=3;
	$('input:radio[name=words]')[0].checked = true;
	speechOrFreq=true;
	$("#speech").show();
	$("#frequency").hide();
	$(window).on('resize', function(){
		isResized=true;
		$( "#accordion" ).accordion('destroy');
		$( "#accordionA" ).accordion('destroy');
		computeHeight();
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
		width_a11=$("#a11").width();
		width_a12=$("#a12").width();
		width_a21=$("#a21").width();
		width_a22=$("#a22").width();
		loadTab1();
		loadCorr1();
		loadCorr2();
		loadCorr3();
		loadCorr5();
		updateCorr3(currentPages);
		//restore(0);
		//restore(1);
		//restore(2);
		//restore(3);
		d3.select("#background"+currentPos).style("fill",colorActive);	
	});
}); 

function refresh(){

	loadTab1();
	loadCorr1();
	loadCorr2();
	loadCorr3();
	loadCorr5();
	updateCorr3(currentPages);
	restore(0);
	restore(1);
	restore(2);
	restore(3);
}

function appendArticle(){
	var tmp=""
	tmp+="title="+$("#articletitle").val()+"&content="+$("#articlecontent").val()+"&type=2";
	dialog1.dialog("close");
	reload("corpusName="+currentCorpus+"&"+tmp);	
}

function importArticle(){
	$("#warning1").text("");
	$("#warning2").text("");
	console.log("input="+$( "#corpustitle" ).val());
	corpusNameSet.forEach(function(str){
		console.log("str="+str);
		if(str==$( "#corpustitle" ).val()){
			$("#warning1").text("the corpus already exists!");
			return;
		}
	});
	if($( "#corpusfile" )[0].files[0]==null){
		$("#warning2").text("No file is selected!");
		return;
	}
	//return;
	var progressbar = $( "#progressbar" ),
	progressLabel = $( ".progress-label" );
	$( ".progress-label" ).text("Loading...");	
	$('#pagewrapper').hide();
	$( "#progressbar").show();
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
	
	//console.loc($( "#corpusfile" ).val());
	//console.loc($( "#corpustitle" ).val());
	
// 	var fileObj = $( "#corpusfile" )[0].files[0];
// 	var corpusName= $( "#corpustitle" ).val();
// 	var FileController = "/NLPVis/uploadServlet";
// 
// 	// FormData object
// 	var form = new FormData();
// 	form.append("corpusName", corpusName);        
// 	form.append("file", fileObj);  
// 	// XMLHttpRequest object
// 	var xhr = new XMLHttpRequest();
// 	xhr.open("post", FileController, true);
// 	xhr.onload = function () {
// 		console.loc("after");
// 		console.loc("corpusName="+corpusName);
// 
// 	};
// 	xhr.send(form);

	var fd = new FormData();    
	fd.append( 'file', $( "#corpusfile" )[0].files[0] );
	fd.append('corpusName',$("#corpustitle").val());
	currentCorpus=$("#corpustitle").val();
	//console.log("corpustitle="+$("#corpustitle").val());
	dialog2.dialog("close");
	currentPages=0;
	currentPos=0;
	$.ajax({
	  url: '/NLPVis/uploadServlet',
	  data: fd,
	  processData: false,
	  contentType: false,
	  type: 'POST',
	  success: function(data){
		//alert(data);
		//parameter="corpusName="+corpusName+"&type=3";
		parameter="corpusName="+currentCorpus+"&type=3";		
		//$.post('/NLPVis/textVisServlet','corpusName='+currentCorpus, function(responseText) {
		$.post('/NLPVis/textVisServlet',parameter, function(responseText) {
			matching=responseText.matching.children;
			corpusStatistics=responseText.corpusStatistics;
			corpusNameSet=responseText.corpusNameSet.nameSet;
			totalNum=corpusStatistics.articles;
			totalPages=corpusStatistics.totalPages;
			articlesStatistics=responseText.articlesStatistics.children;
			corpusStr=responseText.corpusStr.children;
			corpusTxt=responseText.corpusTxt.children;
			//speeches=responseText.colors.speeches;
			//freqs=responseText.colors.freqs;
			currentPage=0;
			currentPos=0;
			if(totalNum==1){
				$("#beginning" ).button("disable");
				$("#rewind" ).button("disable");
				$("#forward" ).button("disable");
				$("#end" ).button("disable");
			}
			else{
				$("#beginning" ).button("disable");
				$("#rewind" ).button("disable");
			}
			$("#inputpages").val("1");
			loadTab1();
			loadCorr1();
			loadCorr2();
			loadCorr3();
			loadCorr5();
			updateCorr3(currentPages);
			$( "#progressbar" ).progressbar( "value", 100 );
			d3.select("#background"+currentPos).style("fill",colorActive);	

	  });
	}
	});
}

function switchCorpus(){
	currentCorpus=$("#corpusSet").val(); 
	reload("corpusName="+currentCorpus+"&"+"&type=1");			
}

function getWidths() {
	//col1_width=$("#showArticle").width();
	//col2_width=$("#tabs").width();
	//col3_width=$("#content").width();
	col1_width=25;
	col2_width=52;
	col3_width=22;
}

function computeHeight(){

	var windowHeight=$(window).height()-20;
	//alert(windowHeight);
	$("#pagewrapper").height(windowHeight);
	$("#showArticle").height(windowHeight);
	$("#accordionA").height(windowHeight);
	//$("#accordion1").height(windowHeight-10);
	$("#content").height(windowHeight);
	$("#accordion").height(windowHeight);
	//$("#accordion2").height(windowHeight-10);
	//$("#accordion3").height(windowHeight-10);
	//$("#accordion4").height(windowHeight-10);
	//$("#tabs").height(windowHeight);
	$("#tabs-1").height(windowHeight-50);
	svgHeight=(windowHeight-50)/2-6;
	//alert(svgHeight);
	$("a11").height(svgHeight);
	$("a12").height(svgHeight);
	$("a21").height(svgHeight);
	$("a22").height(svgHeight);
	var pagesWidth=$("#pagewrapper").width();
	var leftString=(pagesWidth-400)/2+"px";
	var pagesHeight=$("#pagewrapper").height();
	var topString=(pagesHeight-40)/2+"px";
	$("#progressbar").css({left:leftString});;
	$("#progressbar").css({top:topString});;
	//progressbar
	//$( "#accordionA" ).accordion("option", "heightStyle","fill");
	//$( "#accordion" ).accordion("option", "heightStyle","fill");
}

function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

function reload(parameter){


	currentPages=0;
	currentPos=0;
	//currentCorpus="toefl2";
	//currentCorpus=getURLParameter("name");	
	//if(currentCorpus=="null"){
	//	currentCorpus="toefl";
	//}
	$('#pagewrapper').hide();
	$( "#progressbar").show();
	var progressbar = $( "#progressbar" ),
	progressLabel = $( ".progress-label" );
	$( ".progress-label" ).text("Loading...");	
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
	//$.post('/NLPVis/textVisServlet','corpusName='+currentCorpus, function(responseText) {
	$.post('/NLPVis/textVisServlet',parameter, function(responseText) {

		$( "#progressbar" ).progressbar( "value", 100 );
		matching=responseText.matching.children;
		corpusStatistics=responseText.corpusStatistics;
		corpusNameSet=responseText.corpusNameSet.nameSet;
		totalNum=corpusStatistics.articles;
		totalPages=corpusStatistics.totalPages;
		articlesStatistics=responseText.articlesStatistics.children;
		corpusStr=responseText.corpusStr.children;
		corpusTxt=responseText.corpusTxt.children;
		//speeches=responseText.colors.speeches;
		//freqs=responseText.colors.freqs;
		currentPage=0;
		currentPos=0;
		if(totalNum==1){
			$("#beginning" ).button("disable");
			$("#rewind" ).button("disable");
			$("#forward" ).button("disable");
			$("#end" ).button("disable");
		}
		else{
			$("#beginning" ).button("disable");
			$("#rewind" ).button("disable");
			$("#forward" ).button("enable");
			$("#end" ).button("enable");
		}
		$("#inputpages").val("1");
		loadTab1();
		loadCorr1();
		loadCorr2();
		loadCorr3();
		loadCorr5();
		updateCorr3(currentPages);
		d3.select("#background"+currentPos).style("fill",colorActive);	
	});
}

function init_servlet(){
	//currentCorpus=getURLParameter("name");	
	//if(currentCorpus=="null"){
	//	currentCorpus="toefl";
	//}
	//console.log(currentCorpus);
	//alert("come here"+currentCorpus);	
	
	$.post('/NLPVis/textVisServlet','type=1&corpusName='+currentCorpus, function(responseText) {
		//data=responseText;
		//console.log(responseText);
		$( "#progressbar" ).progressbar( "value", 100 );
		matching=responseText.matching.children;
		corpusStatistics=responseText.corpusStatistics;
		corpusNameSet=responseText.corpusNameSet.nameSet;
		totalNum=corpusStatistics.articles;
		currentPage=0;
		currentPos=0;
		if(totalNum==1){
			$("#beginning" ).button("disable");
			$("#rewind" ).button("disable");
			$("#forward" ).button("disable");
			$("#end" ).button("disable");
		}
		else{
			$("#beginning" ).button("disable");
			$("#rewind" ).button("disable");
		}
		$("#inputpages").val("1");
		totalPages=corpusStatistics.totalPages;
		articlesStatistics=responseText.articlesStatistics.children;
		corpusStr=responseText.corpusStr.children;
		corpusTxt=responseText.corpusTxt.children;
		$.cookie.json = true;
		if($.cookie('speeches')==undefined){
			speeches=responseText.colors.speeches;
			//console.log("1"+speeches[0].name+"="+speeches[0].color);
			$.cookie('speeches', speeches, { expires: 20*365 });
		}
		else {
			speeches=$.cookie('speeches');
			//console.log("2"+speeches[0].name+"="+speeches[0].color);
		}
		if($.cookie('freqs')==undefined){
			freqs=responseText.colors.freqs;
			//console.log("3"+freqs[0].name+"="+freqs[0].color);
			$.cookie('freqs', freqs, { expires: 20*365 });
		}
		else {
			freqs=$.cookie('freqs');
			//console.log("4"+freqs[0].name+"="+freqs[0].color);
		}
		newColorPicker(speeches,freqs);
		/*
		gStratistics="<p>"+"Corpus Name: "+ corpusStatistics.corpus+ "</p>";
		gStratistics=gStratistics+"<p>"+"# of Articles: "+ corpusStatistics.articles+ "</p>";
		gStratistics=gStratistics+"<p>"+"# of Sentences: "+ corpusStatistics.sentences+ "</p>";
		gStratistics=gStratistics+"<p>"+"# of Words: "+ corpusStatistics.words+ "</p>";
		gStratistics=gStratistics+"<hr/>";
		*/
		loadTab1();
		loadCorr1();
		loadCorr2();
		loadCorr3();
		loadCorr5();
		updateCorr3(currentPages);
		d3.select("#inputpages").property("value",1);
		d3.select("#title1").text(space[currentPos]);		
		d3.select("#title2").text("Statistics("+space[currentPos]+")");	
		d3.select("#background0").style("fill",colorActive);
		d3.select("#background1").style("fill",colorInactive);
		d3.select("#background2").style("fill",colorInactive);
		d3.select("#background3").style("fill",colorInactive);	
		getWidths();
	});
}

function changeCurrentPos(newPos){
	var oldPos=newPos;
	currentPos=newPos;
	loadCorr1();
	loadCorr2();
	updateCorr3(currentPages);
	d3.select("#title1").text(space[currentPos]);		
	d3.select("#title2").text("Statistics("+space[currentPos]+")");	
}

function changeCurrentPage(newPage){
	var oldPage=currentPages;
	currentPages=newPage;
	loadTab1();
	loadCorr1();
	loadCorr2();
	updateCorr3(oldPage);
	//console.log("pages="+d3.select("#inputpages").property("value"));
	d3.select("#inputpages").property("value",(currentPages+1).toString());	
	d3.select("#title1").text(space[currentPos]);		
	d3.select("#title2").text("Statistics("+space[currentPos]+")");	
	//alert("#background"+currentPos.toString());
	d3.select("#background"+currentPos.toString()).style("fill",colorActive);
}

// Load the first tab.
function loadTab1(){

	//var width_local=$("#a11").width();
	//alert(width_local);
	var heigth_local=svgHeight;
	//console.log("currentPages="+currentPages);
	//console.log("totalNum="+totalNum);

	//#a11
	if(currentPages*4+1<=totalNum){
		str=matching.filter(function(num){
			if (num.loc==(currentPages*4+0+1)){
				return num;
			}
		})[0].name;
		if((isResized)||(str!=space[0])) {
			$( "#a11" ).css("border","1px solid");
			drawArticlesNew('#a11', 0, width_a11, heigth_local, corpusStr.filter(function(element){
				if(element.name==str){
					return element;
				}
			})[0]);
			space[0]=str;
		}
	}
	else{
		$( "#a11" ).css("border","0px solid");
		d3.select("#a11").select("svg").remove();
		space[0]="";
	}
	
	//#a12
	if(currentPages*4+2<=totalNum){
		str=matching.filter(function(num){
			if (num.loc==(currentPages*4+1+1)){
				return num;
			}
		})[0].name;
		if((isResized)||(str!=space[1])){
			$( "#a12" ).css("border","1px solid");
			drawArticlesNew('#a12', 1, width_a12, heigth_local, corpusStr.filter(function(element){
				if(element.name==str){
					return element;
				}
			})[0]);
			space[1]=str;
		}
	}
	else {
		$( "#a12" ).css("border","0px solid");
		d3.select("#a12").select("svg").remove();
		space[1]="";
	}
	
	//#a21
	if(currentPages*4+3<=totalNum){
		$( "#a21" ).css("border","1px solid");
		str=matching.filter(function(num){
			if (num.loc==(currentPages*4+2+1)){
				return num;
			}
		})[0].name;
		if((isResized)||(str!=space[2])){
			$( "#a21" ).css("border","1px solid");
			drawArticlesNew('#a21', 2, width_a21, heigth_local, corpusStr.filter(function(element){
				if(element.name==str){
					return element;
				}
			})[0]);
			space[2]=str;
		}
	}
	else {
		$( "#a21" ).css("border","0px solid");
		d3.select("#a21").select("svg").remove();
		space[2]="";
	}
	
	//#a22
	if(currentPages*4+4<=totalNum){
		str=matching.filter(function(num){
			if (num.loc==(currentPages*4+3+1)){
				return num;
			}
		})[0].name;
		if((isResized)||(str!=space[3])){
			$( "#a22" ).css("border","1px solid");
			drawArticlesNew('#a22', 3, width_a22, heigth_local, corpusStr.filter(function(element){
				if(element.name==str){
					return element;
				}
			})[0]);
			space[3]=str;
		}
	}
	else {
		$( "#a22" ).css("border","0px solid");
		d3.select("#a22").select("svg").remove();
		space[3]="";
	}
	
	if(isResized){
		isResized=false;	
	}
}

// Load the first accordion.
function loadCorr1(){
	d3.select("#title1").text(space[currentPos]);		
	str=matching.filter(function(num){
		//console.log("loadCorr1 "+num.loc+","+ (currentPages*4+currentPos+1));
		if (num.loc==(currentPages*4+currentPos+1)){
			return num;
		}
	})[0].name;
	var txt=corpusTxt.filter(function(num){
		if(num.name==str){
			return num;
		}	
	})[0].content;
	d3.select("#accordion1").html(txt);		
}

// Load the second accordion.
function loadCorr2(){
	d3.select("#title2").text("Statistics("+space[currentPos]+")");	var txt;
	//txt=gStratistics;
	txt="";
	var anArticle=articlesStatistics.filter(function(num){
		if(num.name==space[currentPos]){
			return num;
		}
	})[0];
	txt=txt+"<p>"+"Article: "+anArticle.name+"</p>";
	txt=txt+"<p>"+"# of Sentences: "+anArticle.sentences+"</p>";
	txt=txt+"<p>"+"# of words: "+anArticle.words+"</p>";
	txt=txt+"<p> Flesh-Kincaid grade level: "+anArticle.fleschKincaidIndex+"</p>";
	txt=txt+"<p> Flesh reading ease score: "+anArticle.fleschIndex+"</p>";
	txt=txt+"<p> Gunning fog index: "+anArticle.fogIndex+"</p>";
	txt=txt+"<p> Lexical density: "+anArticle.lexicalDensity.toPrecision(5)+"</p>";
	txt=txt+"<p> Max sentence length: "+anArticle.maxSentenceLength+"</p>";
	txt=txt+"<p> Average sentence length: "+anArticle.averageSentenceLength.toPrecision(5)+"</p>";
	txt=txt+"<p> Min sentence length: "+anArticle.minSentenceLength+"</p>";
	txt=txt+"<p> Percentage of nouns: "+anArticle.perceNoun.toPrecision(5)+"</p>";
	txt=txt+"<p> Percentage of adjectives: "+anArticle.perceAdj.toPrecision(5)+"</p>";
	txt=txt+"<p> Percentage of verbs: "+anArticle.perceVerb.toPrecision(5)+"</p>";
	txt=txt+"<p> Percentage of adverbs : "+anArticle.perceAdv.toPrecision(5)+"</p>";
	txt=txt+"<p> Number of different words : "+anArticle.uniqueWords+"</p>";

	d3.select("#accordion2").html(txt);
}

// Load the third accordion.
function loadCorr3(){

	var txt="<ul id=\"sortable\">";
	matching.forEach(function(num){
		txt=txt+"<li class=\"ui-state-default\" id=\"";
		txt=txt+"l"+num.id+"\">"+num.name+"</li>";
	})
	txt=txt+"<li class=\"ui-state-default\" id=\"";
	txt=txt+"appendid"+"\">"+"New"+"</li>";
	txt=txt+"</ul>";
	d3.select("#accordion3").html(txt);	
	//Sortable
	$(function() {
		$( "#sortable" ).sortable({
			start: function(event, ui) {
				startPos=ui.item.index();
			},
			change: function(event, ui) {
				endPos = ui.placeholder.index();
			},
			stop: function(event,ui){
				
				matching.forEach(function(element){
					if((element.loc>=currentPages*4+1)&&(element.loc<=currentPages*4+4)){
						var id="#l"+element.id;
						//console.log(id);
						d3.select(id).text(element.name);
		
					}
				});
				
				$.each(matching,function(){
					if(startPos>endPos){
						if((this.loc-1)==startPos){
							this.loc=endPos+1;
						}
						else if((this.loc<=startPos)&&(this.loc>=(endPos+1))){
							this.loc=this.loc+1;
						}
					}
					else if (startPos<endPos){
						if((this.loc-1)==startPos){
							this.loc=endPos;
						}
						else if((this.loc>=(startPos+2))&&(this.loc<=endPos)){
							this.loc=this.loc-1;
						}
					}
				});
				
				matching.forEach(function(element){
					if((element.loc>=currentPages*4+1)&&(element.loc<=currentPages*4+4)){
						var id="#l"+element.id;
						//console.log(id);
						if(element.loc==(currentPages*4+currentPos+1)){
							d3.select(id).text(element.name+"*");
						}
						else{
							d3.select(id).text(element.name+"#");
						}
					}
				});
				loadTab1();
			}
		});
		
		$("#sortable li").on('click',function(){
			if($(this).text()=="New"){
				dialog1.dialog("open");
			}
			else {
				var theIndex = $(this).index();
				//alert(theIndex);
				var oldPage=currentPages;
				var oldPos=currentPos;
				currentPages=Math.floor(theIndex/4);
				currentPos=theIndex % 4;
				loadTab1();
				loadCorr1();
				loadCorr2();
				updateCorr3(oldPage);
				//console.log("pages="+d3.select("#inputpages").property("value"));
				d3.select("#inputpages").property("value",(currentPages+1).toString());	
				d3.select("#title1").text(space[currentPos]);		
				d3.select("#title2").text("Statistics("+space[currentPos]+")");	
				//alert("#background"+currentPos.toString());
				d3.select("#background0").style("fill",colorInactive);
				d3.select("#background1").style("fill",colorInactive);
				d3.select("#background2").style("fill",colorInactive);
				d3.select("#background3").style("fill",colorInactive);
				d3.select("#background"+currentPos.toString()).style("fill",colorActive);
				//alert($(this).
				if(totalPages>1){
					if(currentPages==(totalPages-1)){
						$("#forward" ).button("disable");
						$( "#end" ).button("disable");
						$("#beginning" ).button("enable");
						$( "#rewind" ).button("enable");
					}
					else if(currentPages==0){
						$("#forward" ).button("enable");
						$( "#end" ).button("enable");
						$("#beginning" ).button("disable");
						$( "#rewind" ).button("disable");
					}
					else {
						$("#forward" ).button("enable");
						$( "#end" ).button("enable");
						$("#beginning" ).button("enable");
						$( "#rewind" ).button("enable");
					}
				}

			}
    	});
		
		//$( "#sortable" ).disableSelection();
});	
	/*
	<ul id="sortable">
	<li class="ui-state-default" id="l1">1</li>
	<li class="ui-state-default" id="l2">2</li>
	<li class="ui-state-default" id="l3">3</li>
	<li class="ui-state-default" id="l4">4</li>
	<li class="ui-state-default" id="l5">5</li>
	<li class="ui-state-default" id="l6">6</li>
	<li class="ui-state-default" id="l7">7</li>
	<li class="ui-state-default" id="l8">8</li>
	<li class="ui-state-default" id="l9">9</li>
	<li class="ui-state-default" id="l10">10</li>
	<li class="ui-state-default" id="l11">11</li>
	<li class="ui-state-default" id="l12">12</li>
	<li class="ui-state-default" id="l13">13</li>
	<li class="ui-state-default" id="l14">14</li>
	<li class="ui-state-default" id="l15">15</li>
	<li class="ui-state-default" id="l16">16</li>
	<li class="ui-state-default" id="l17">17</li>
	<li class="ui-state-default" id="l18">18</li>
	<li class="ui-state-default" id="l19">19</li>
	<li class="ui-state-default" id="l20">20</li>
	<li class="ui-state-default" id="l21">21</li>
	<li class="ui-state-default" id="l22">22</li>
	<li class="ui-state-default" id="l23">23</li>
	<li class="ui-state-default" id="l24">24</li>
	<li class="ui-state-default" id="l25">25</li>
	<li class="ui-state-default" id="l26">26</li>
	<li class="ui-state-default" id="l27">27</li>
	<li class="ui-state-default" id="l28">28</li>
	<li class="ui-state-default" id="l29">29</li>
	<li class="ui-state-default" id="l30">30</li>
	<li class="ui-state-default" id="l31">31</li>
	<li class="ui-state-default" id="l32">32</li>
	<li class="ui-state-default" id="l33">33</li>
	<li class="ui-state-default" id="l34">34</li>
	<li class="ui-state-default" id="l35">35</li>
	<li class="ui-state-default" id="l36">36</li>
	<li class="ui-state-default" id="l37">37</li>
	<li class="ui-state-default" id="l38">38</li>
	<li class="ui-state-default" id="l39">39</li>
	<li class="ui-state-default" id="l40">40</li>
	</ul>
	*/		
}

//load the fifth accordion.
function loadCorr5(){
	var txt="";
	txt=txt+"<div id=\"corpusDiv\"><label>Please set a corpus as active</label><br/><br/><select name=\"corpusSet\" id=\"corpusSet\">";
	//console.log(corpusNameSet);
	corpusNameSet.forEach(function(str){
		if(str===currentCorpus){
			txt=txt+"<option selected=\"selected\">"+str+"</option>";
		}
		else{
			txt=txt+"<option>"+str+"</option>";
		}
	});
	txt=txt+"</select><button id=\"newCorpus\">Apply</button><hr/><br/>";
	txt=txt+"<button id=\"importCorpus\">Import a new corpus</button></div>";
	d3.select("#accordion5").html(txt);	
	$("#corpusSet").selectmenu();
	$( "#newCorpus" ).button({
		text: true
	})
	.click(function() {
		switchCorpus();
		//dialog1.dialog("open");
		//reload()
		//var tmp=document.getElementById("corpusSet").value;
		//alert(currentCorpus);
		//window.location.href = location.protocol + '//' + location.host + location.pathname+"?name="+tmp;
	});
	$( "#importCorpus" ).button({
		text: true
	})
	.click(function() {
		//switchCorpus();
		dialog2.dialog("open");
		//reload()
		//var tmp=document.getElementById("corpusSet").value;
		//alert(currentCorpus);
		//window.location.href = location.protocol + '//' + location.host + location.pathname+"?name="+tmp;
	});
}

function updateCorr3(oldPage){
	matching.forEach(function(element){
		if((element.loc>=oldPage*4+1)&&(element.loc<=oldPage*4+4)){
			var id="#l"+element.id;
			//console.log(id);
			d3.select(id).text(element.name);
		}
	});
	matching.forEach(function(element){
		if((element.loc>=currentPages*4+1)&&(element.loc<=currentPages*4+4)){
			var id="#l"+element.id;
			//console.log(id);
			//d3.select(id).text(element.name+"*");
			if(element.loc==(currentPages*4+currentPos+1)){
				d3.select(id).text(element.name+"*");
			}
			else{
				d3.select(id).text(element.name+"#");
			}
		}
	});
}

