// global var
var width_axe=70;
var width_axe2=70;
var height_axe=20;
var height_yaxe=35;

var yscale ;
var yscale2;
var format = d3.time.format("%b %e, %Y %I:%M:%S %p");
var xscale;

var tennisMatch;
var dataSet = [];
var svgs = [];
var numOfSvgs;
var colors = [];
var players = [];

var svgPeople = [];
var svgCharacter = [];
var charName = [];
var stats = [];
var slidevalue = 3;
var maxRally = 1;

var svgLegend;

var circleSize = 3;

function checkboxChange(){
	var svgPeopleTmp = [];
	var svgCharacterTmp = [];
	var changeFlag = false;
	var color1 = "#ff8080";
	var color2 = "black";

	//alert("changeFlag="+changeFlag);	
	if(document.getElementById("p1").checked==true){
		svgPeopleTmp[0]=1;
		document.getElementById("ppl1").style.fontWeight = "bold";
		document.getElementById("ppl1").style.color = color1;
	}
	else{
		document.getElementById("ppl1").style.fontWeight = "normal";
		document.getElementById("ppl1").style.color = color2;
		svgPeopleTmp[0]=0;
	}

	if(document.getElementById("p2").checked==true){
		document.getElementById("ppl2").style.fontWeight = "bold";
		document.getElementById("ppl2").style.color = color1;
		svgPeopleTmp[1]=1;
	}
	else{
		svgPeopleTmp[1]=0;
		document.getElementById("ppl2").style.fontWeight = "normal";
		document.getElementById("ppl2").style.color = color2;
	}

	if(document.getElementById("ACE").checked==true){
		svgCharacterTmp[0]=1;
		changeFlag = true;
		document.getElementById("label_ACE").style.fontWeight = "bold";
		document.getElementById("label_ACE").style.color = color1;
	}
	else{
		svgCharacterTmp[0]=0;
		document.getElementById("label_ACE").style.fontWeight = "normal";
		document.getElementById("label_ACE").style.color = color2;
	}	
	
	if(document.getElementById("FF").checked==true){
		svgCharacterTmp[1]=1;
		changeFlag = true;
		document.getElementById("label_FF").style.fontWeight = "bold";
		document.getElementById("label_FF").style.color = color1;
	}
	else{
		svgCharacterTmp[1]=0;
		document.getElementById("label_FF").style.fontWeight = "normal";
		document.getElementById("label_FF").style.color = color2;
	}	
		
	if(document.getElementById("DF").checked==true){
		svgCharacterTmp[2]=1;
		changeFlag = true;
		document.getElementById("label_DF").style.fontWeight = "bold";
		document.getElementById("label_DF").style.color = color1;
	}
	else{
		svgCharacterTmp[2]=0;
		document.getElementById("label_DF").style.fontWeight = "normal";
		document.getElementById("label_DF").style.color = color2;
	}
	
	if(document.getElementById("fhtopspin").checked==true){
		svgCharacterTmp[3]=1;
		changeFlag = true;
		document.getElementById("label_fhtopspin").style.fontWeight = "bold";
		document.getElementById("label_fhtopspin").style.color = color1;
	}
	else{
		svgCharacterTmp[3]=0;
		document.getElementById("label_fhtopspin").style.fontWeight = "normal";
		document.getElementById("label_fhtopspin").style.color = color2;
	}
	
	if(document.getElementById("bhtopspin").checked==true){
		svgCharacterTmp[4]=1;
		changeFlag = true;
		document.getElementById("label_bhtopspin").style.fontWeight = "bold";
		document.getElementById("label_bhtopspin").style.color = color1;
	}
	else{
		svgCharacterTmp[4]=0;
		document.getElementById("label_bhtopspin").style.fontWeight = "normal";
		document.getElementById("label_bhtopspin").style.color = color2;
	}
	
	if(document.getElementById("fhslice").checked==true){
		svgCharacterTmp[5]=1;
		changeFlag = true;
		document.getElementById("label_fhslice").style.fontWeight = "bold";
		document.getElementById("label_fhslice").style.color = color1;
	}
	else{
		svgCharacterTmp[5]=0;
		document.getElementById("label_fhslice").style.fontWeight = "normal";
		document.getElementById("label_fhslice").style.color = color2;
	}
	
	if(document.getElementById("bhslice").checked==true){
		svgCharacterTmp[6]=1;
		changeFlag = true;
		document.getElementById("label_bhslice").style.fontWeight = "bold";
		document.getElementById("label_bhslice").style.color = color1;
	}
	else{
		svgCharacterTmp[6]=0;
		document.getElementById("label_bhslice").style.fontWeight = "normal";
		document.getElementById("label_bhslice").style.color = color2;
	}
	
	if(document.getElementById("volley").checked==true){
		svgCharacterTmp[7]=1;
		changeFlag = true;
		document.getElementById("label_volley").style.fontWeight = "bold";
		document.getElementById("label_volley").style.color = color1;
	}
	else{
		svgCharacterTmp[7]=0;
		document.getElementById("label_volley").style.fontWeight = "normal";
		document.getElementById("label_volley").style.color = color2;
	}
	
	if(document.getElementById("smash").checked==true){
		svgCharacterTmp[8]=1;
		changeFlag = true;
		document.getElementById("label_smash").style.fontWeight = "bold";
		document.getElementById("label_smash").style.color = color1;
	}
	else{
		svgCharacterTmp[8]=0;
		document.getElementById("label_smash").style.fontWeight = "normal";
		document.getElementById("label_smash").style.color = color2;
	}
	
	if(document.getElementById("dropshot").checked==true){
		svgCharacterTmp[9]=1;
		changeFlag = true;
		document.getElementById("label_dropshot").style.fontWeight = "bold";
		document.getElementById("label_dropshot").style.color = color1;
	}
	else{
		svgCharacterTmp[9]=0;
		document.getElementById("label_dropshot").style.fontWeight = "normal";
		document.getElementById("label_dropshot").style.color = color2;
	}
	
	if(document.getElementById("lob").checked==true){
		svgCharacterTmp[10]=1;
		changeFlag = true;
		document.getElementById("label_lob").style.fontWeight = "bold";
		document.getElementById("label_lob").style.color = color1;
	}
	else{
		svgCharacterTmp[10]=0;
		document.getElementById("label_lob").style.fontWeight = "normal";
		document.getElementById("label_lob").style.color = color2;
	}
	
	if(document.getElementById("hvolley").checked==true){
		svgCharacterTmp[11]=1;
		changeFlag = true;
		document.getElementById("label_hvolley").style.fontWeight = "bold";
		document.getElementById("label_hvolley").style.color = color1;
	}
	else{
		svgCharacterTmp[11]=0;
		document.getElementById("label_hvolley").style.fontWeight = "normal";
		document.getElementById("label_hvolley").style.color = color2;
	}
	
	if(document.getElementById("svolley").checked==true){
		svgCharacterTmp[12]=1;
		changeFlag = true;
		document.getElementById("label_svolley").style.fontWeight = "bold";
		document.getElementById("label_svolley").style.color = color1;
	}
	else{
		svgCharacterTmp[12]=0;
		document.getElementById("label_svolley").style.fontWeight = "normal";
		document.getElementById("label_svolley").style.color = color2;
	}
	
	if(document.getElementById("winner").checked==true){
		svgCharacterTmp[13]=1;
		changeFlag = true;
		document.getElementById("label_winner").style.fontWeight = "bold";
		document.getElementById("label_winner").style.color = color1;
	}
	else{
		svgCharacterTmp[13]=0;
		document.getElementById("label_winner").style.fontWeight = "normal";
		document.getElementById("label_winner").style.color = color2;
	}
	
	if(document.getElementById("UE").checked==true){
		svgCharacterTmp[14]=1;
		changeFlag = true;
		document.getElementById("label_UE").style.fontWeight = "bold";
		document.getElementById("label_UE").style.color = color1;
	}
	else{
		svgCharacterTmp[14]=0;
		document.getElementById("label_UE").style.fontWeight = "normal";
		document.getElementById("label_UE").style.color = color2;
	}
	
	if(document.getElementById("FE").checked==true){
		svgCharacterTmp[15]=1;
		changeFlag = true;
		document.getElementById("label_FE").style.fontWeight = "bold";
		document.getElementById("label_FE").style.color = color1;
	}
	else{
		svgCharacterTmp[15]=0;
		document.getElementById("label_FE").style.fontWeight = "normal";
		document.getElementById("label_FE").style.color = color2;
	}		
	
	if(document.getElementById("rally").checked==true){
		svgCharacterTmp[16]=1;
		changeFlag = true;
		document.getElementById("label_rally").style.fontWeight = "bold";
		document.getElementById("label_rally").style.color = color1;
	}
	else{
		svgCharacterTmp[16]=0;
		document.getElementById("label_rally").style.fontWeight = "normal";
		document.getElementById("label_rally").style.color = color2;
	}
	
	if(document.getElementById("wide").checked==true){
		svgCharacterTmp[17]=1;
		changeFlag = true;
		document.getElementById("label_wide").style.fontWeight = "bold";
		document.getElementById("label_wide").style.color = color1;
	}
	else{
		svgCharacterTmp[17]=0;
		document.getElementById("label_wide").style.fontWeight = "normal";
		document.getElementById("label_wide").style.color = color2;
	}
	
	if(document.getElementById("body").checked==true){
		svgCharacterTmp[18]=1;
		changeFlag = true;
		document.getElementById("label_body").style.fontWeight = "bold";
		document.getElementById("label_body").style.color = color1;
	}
	else{
		svgCharacterTmp[18]=0;
		document.getElementById("label_body").style.fontWeight = "normal";
		document.getElementById("label_body").style.color = color2;
	}
	
	if(document.getElementById("downthet").checked==true){
		svgCharacterTmp[19]=1;
		changeFlag = true;
		document.getElementById("label_downthet").style.fontWeight = "bold";
		document.getElementById("label_downthet").style.color = color1;
	}
	else{
		svgCharacterTmp[19]=0;
		document.getElementById("label_downthet").style.fontWeight = "normal";
		document.getElementById("label_downthet").style.color = color2;
	}
	
	if(document.getElementById("bpoints").checked==true){
		svgCharacterTmp[20]=1;
		changeFlag = true;
		document.getElementById("label_bpoints").style.fontWeight = "bold";
		document.getElementById("label_bpoints").style.color = color1;
	}
	else{
		svgCharacterTmp[20]=0;
		document.getElementById("label_bpoints").style.fontWeight = "normal";
		document.getElementById("label_bpoints").style.color = color2;
	}
	
	if(document.getElementById("gpoints").checked==true){
		svgCharacterTmp[21]=1;
		changeFlag = true;
		document.getElementById("label_gpoints").style.fontWeight = "bold";
		document.getElementById("label_gpoints").style.color = color1;
	}
	else{
		svgCharacterTmp[21]=0;
		document.getElementById("label_gpoints").style.fontWeight = "normal";
		document.getElementById("label_gpoints").style.color = color2;
	}
	
	if(document.getElementById("spoints").checked==true){
		svgCharacterTmp[22]=1;
		changeFlag = true;
		document.getElementById("label_spoints").style.fontWeight = "bold";
		document.getElementById("label_spoints").style.color = color1;
	}
	else{
		svgCharacterTmp[22]=0;
		document.getElementById("label_spoints").style.fontWeight = "normal";
		document.getElementById("label_spoints").style.color = color2;
	}
	
	if(document.getElementById("mpoints").checked==true){
		svgCharacterTmp[23]=1;
		changeFlag = true;
		document.getElementById("label_mpoints").style.fontWeight = "bold";
		document.getElementById("label_mpoints").style.color = color1;
	}
	else{
		svgCharacterTmp[23]=0;
		document.getElementById("label_mpoints").style.fontWeight = "normal";
		document.getElementById("label_mpoints").style.color = color2;
	}
	
	if(document.getElementById("shallow").checked==true){
		svgCharacterTmp[24]=1;
		changeFlag = true;
		document.getElementById("label_shallow").style.fontWeight = "bold";
		document.getElementById("label_shallow").style.color = color1;
	}
	else{
		svgCharacterTmp[24]=0;
		document.getElementById("label_shallow").style.fontWeight = "normal";
		document.getElementById("label_shallow").style.color = color2;
	}
	
	if(document.getElementById("mdeep").checked==true){
		svgCharacterTmp[25]=1;
		changeFlag = true;
		document.getElementById("label_mdeep").style.fontWeight = "bold";
		document.getElementById("label_mdeep").style.color = color1;
	}
	else{
		svgCharacterTmp[25]=0;
		document.getElementById("label_mdeep").style.fontWeight = "normal";
		document.getElementById("label_mdeep").style.color = color2;
	}
	
	if(document.getElementById("vdeep").checked==true){
		svgCharacterTmp[26]=1;
		changeFlag = true;
		document.getElementById("label_vdeep").style.fontWeight = "bold";
		document.getElementById("label_vdeep").style.color = color1;
	}
	else{
		svgCharacterTmp[26]=0;
		document.getElementById("label_vdeep").style.fontWeight = "normal";
		document.getElementById("label_vdeep").style.color = color2;
	}
	
	if(document.getElementById("approach").checked==true){
		svgCharacterTmp[27]=1;
		changeFlag = true;
		document.getElementById("label_approach").style.fontWeight = "bold";
		document.getElementById("label_approach").style.color = color1;
	}
	else{
		svgCharacterTmp[27]=0;
		document.getElementById("label_approach").style.fontWeight = "normal";
		document.getElementById("label_approach").style.color = color2;
	}
	
	if(document.getElementById("hitnet").checked==true){
		svgCharacterTmp[28]=1;
		changeFlag = true;
		document.getElementById("label_hitnet").style.fontWeight = "bold";
		document.getElementById("label_hitnet").style.color = color1;
	}
	else{
		svgCharacterTmp[28]=0;
		document.getElementById("label_hitnet").style.fontWeight = "normal";
		document.getElementById("label_hitnet").style.color = color2;
	}
	
	if(document.getElementById("hitbaseline").checked==true){
		svgCharacterTmp[29]=1;
		changeFlag = true;
		document.getElementById("label_hitbaseline").style.fontWeight = "bold";
		document.getElementById("label_hitbaseline").style.color = color1;
	}
	else{
		svgCharacterTmp[29]=0;
		document.getElementById("label_hitbaseline").style.fontWeight = "normal";
		document.getElementById("label_hitbaseline").style.color = color2;
	}
	
	if(document.getElementById("rfh").checked==true){
		svgCharacterTmp[30]=1;
		changeFlag = true;
		document.getElementById("label_rfh").style.fontWeight = "bold";
		document.getElementById("label_rfh").style.color = color1;
	}
	else{
		svgCharacterTmp[30]=0;
		document.getElementById("label_rfh").style.fontWeight = "normal";
		document.getElementById("label_rfh").style.color = color2;
	}
	if(document.getElementById("rbh").checked==true){
		svgCharacterTmp[31]=1;
		changeFlag = true;
		document.getElementById("label_rbh").style.fontWeight = "bold";
		document.getElementById("label_rbh").style.color = color1;
	}
	else{
		svgCharacterTmp[31]=0;
		document.getElementById("label_rbh").style.fontWeight = "normal";
		document.getElementById("label_rbh").style.color = color2;
	}
	if(document.getElementById("rmid").checked==true){
		svgCharacterTmp[32]=1;
		changeFlag = true;
		document.getElementById("label_rmid").style.fontWeight = "bold";
		document.getElementById("label_rmid").style.color = color1;
	}
	else{
		svgCharacterTmp[32]=0;
		document.getElementById("label_rmid").style.fontWeight = "normal";
		document.getElementById("label_rmid").style.color = color2;
	}
	
	//alert("changeFlag="+changeFlag);
	if(changeFlag == true){
		svgCharacterTmp[33] = 0;
	}
	else{
		svgCharacterTmp[33] = 1;	
	}
	transform(svgPeopleTmp,svgCharacterTmp);
}

$(document).ready(function() {
 	
	computeHeight();
	
	$( "#reset" ).button({
		text: true
	})
	.click(function() {
		var svgPeopleTmp = [];
		var svgCharacterTmp = []; 
		svgPeopleTmp[0]=1;
		svgPeopleTmp[1]=1;
		document.getElementById("p1").checked = true;
		document.getElementById("p2").checked = true;
		for(i=0;i<24;i++){
			svgCharacterTmp[i]=0;
		}
		svgCharacterTmp[24]=1;
		document.getElementById("wide").checked=false;
		document.getElementById("body").checked=false;
		document.getElementById("downthet").checked=false;
		document.getElementById("ACE").checked=false;
		document.getElementById("FF").checked=false;
		document.getElementById("DF").checked=false;
		document.getElementById("fhtopspin").checked=false;
		document.getElementById("bhtopspin").checked=false;
		document.getElementById("fhslice").checked=false;
		document.getElementById("bhslice").checked=false;
		document.getElementById("volley").checked=false;
		document.getElementById("smash").checked=false;
		document.getElementById("dropshot").checked=false;
		document.getElementById("lob").checked=false;
		document.getElementById("hvolley").checked=false;
		document.getElementById("svolley").checked=false;
		document.getElementById("winner").checked=false;
		document.getElementById("UE").checked=false;
		document.getElementById("FE").checked=false;
		document.getElementById("rally").checked=false;		
		document.getElementById("bpoints").checked=false;				
		document.getElementById("gpoints").checked=false;		
		document.getElementById("spoints").checked=false;		
		document.getElementById("mpoints").checked=false;		

		transform(svgPeopleTmp,svgCharacterTmp);
	});
	
	/*
	$( "#filter" ).button({
		text: true
	})
	.click(function() {
		
	});
	*/
	
	$( "#report" ).button({
		text: true
	})
	.click(function() {play();});	
	progressbar = $( "#progressbar" ),
	progressLabel = $( ".progress-label" );

	progressbar.progressbar({
		value: false,
		create: function(){
		},
		change: function() {
			//progressLabel.text( progressbar.progressbar( "value" ) + "%" );
		},
		complete: function() {
			progressLabel.text( "Complete!" );
			progressbar.hide();
		}
	});
		
	colors[0]="blue";
	colors[1]="red";
	
	dataLoading();
	for(i = 0; i<33; i++){
		stats[i] = new Object();
	}
	charName[0] = "ACE";
	charName[1] = "Fault";
	charName[2] = "Double Fault";
	charName[3] = "FH";
	charName[4] = "BH";
	charName[5] = "FH slice";
	charName[6] = "BH slice";
	charName[7] = "Volley";
	charName[8] = "Smash";
	charName[9] = "Drop shot";
	charName[10] = "Lob";
	charName[11] = "Half-Volley";
	charName[12] = "Swing-Volley";
	charName[13] = "Winner";
	charName[14] = "Unforced Err";
	charName[15] = "Forced Err";
	charName[16] = "Rally";
	charName[17] = "Wide";
	charName[18] = "Body";
	charName[19] = "Down the T";
	charName[20] = "Break Points";
	charName[21] = "Game Points";
	charName[22] = "Set Points";
	charName[23] = "Match Points";
	charName[24] = "Shallow Return";
	charName[25] = "Deep Return";
	charName[26] = "Very Deep Return";
	charName[27] = "Approach";
	charName[28] = "Hit Net";
	charName[29] = "Hit BaseLine";
	charName[30] = "Return to Forehand";
	charName[31] = "Return to Backhand";
	charName[32] = "Return to Middle";
});

function dataLoading(){
	
	progressbar.progressbar({
		value: false,
		create: function(){
		},
		change: function() {
		},
		complete: function() {
			progressLabel.text( "Complete!" );
			progressbar.hide();
		}
	});
	
	$( ".progress-label" ).text("Loading...");	
	$( "#progressbar").show();
	id = getUrlVars()["id"];
	console.log("before"+circleSize);
	if(getUrlVars()["circleSize"]!=undefined){
		circleSize = getUrlVars()["circleSize"];
	}
	console.log(circleSize);
	//alert(id);
	$.post('/Tennis/TennisReaderServlet','type=0&id='+id, function(responseText) {
		tennisMatch=responseText;
		$( "#progressbar" ).progressbar( "value", 100 );
		players[0]=tennisMatch.player1;
		players[1]=tennisMatch.player2;
		//console.log(tennisMatch);
		initData();
		$( "#ppl1" ).text(players[0].split(" ")[1].substring(0,11));
		$( "#ppl2" ).text(players[1].split(" ")[1].substring(0,11));
		/*
		for(i=numOfSvgs+1;i<=5;i++){
			$( "#set"+i ).hide();
			$( "#s"+i ).hide();
		}
		*/
		$( "#slider" ).slider({
			range: "min",
			value: 3,
			min: 1,
			max: maxRally,
			slide: function( event, ui ) {
				$( "#rallyvalue" ).text(ui.value);
				slidevalue = ui.value;
				if(document.getElementById("rally").checked==true){
					checkboxChange();
				}
			}
		});
		$( "#rallyvalue" ).text( $( "#slider" ).slider( "value" ));
		slidevalue = $( "#slider" ).slider( "value" );
	});
}

function computeHeight(){
	var h = 0;
	var windowHeight=$(window).height()-20;
	//console.log("windowHeight="+windowHeight);
	$("#title").height(20);
	$("#content").height(windowHeight-h);
	$("#keyword").height(windowHeight-h);
	$("#input").height(h);
	var pagesWidth=$("#content").width();
	var leftString=(pagesWidth-400)/2+"px";
	var pagesHeight=$("#content").height();
	var topString=(pagesHeight-40)/2+"px";
	$("#progressbar").css({left:leftString});;
	$("#progressbar").css({top:topString});;
}

function addTitle(){
	var div_height=$("#title").height();
	var div_width=$("#title").width();
	svgLegend=d3.select("#title").append("svg")	
	.attr("width", "100%")
	.attr("height", "100%");
	
	svgLegend.append("text")
	.attr("x", 0)
	.attr("y", 15)
	.attr("id","report1")
	.attr("width", 100)
	.attr("height", 20)
	//.text("hello");
		
	var legend = svgLegend.append("g")
	.attr("class", "legend")
	.attr("height", "100%")
	.attr("width", "100%")
	.attr('transform', 'translate('+10+','+0+')')  
	//.attr('transform', 'translate('+(div_width/2-100)+','+0+')')  
	//.attr('transform', 'translate('+(div_width/2-60)+','+0+')')  
	 
	legend.append("rect")
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", 20)
	.attr("height", 20)
	.style("fill", function(d) { 
    	return "blue";
	});
	
	legend.append("text")
	.attr("x", 25)
	.attr("y", 15)
	.attr("id","player1")
	.attr("font-size","15px")
	.attr("font-family","Arial,Helvetica, sans-serif")
	.text(players[0]);
	
	var tmp=d3.select("#player1").node().getComputedTextLength();
	//alert("tmp="+tmp);
	
	legend.append("rect")
	.attr("x", 35+tmp)
	.attr("y", 0)
	.attr("width", 20)
	.attr("height", 20)
	.style("fill", function(d) { 
    	return "red";
	});
	
	tmp=tmp+35+20+5;
	
	legend.append("text")
	.attr("x", tmp)
	.attr("y", 15)
	.attr("id","player2")
	.attr("font-size","15px")
	.attr("font-family","Arial,Helvetica, sans-serif")
	.text(players[1]);
	
	tmp = tmp + d3.select("#player2").node().getComputedTextLength() + 20;

	legend.append("text")
	.attr("x", tmp)
	.attr("y", 15)
	.attr("font-size","15px")
	.attr("font-family","Arial,Helvetica, sans-serif")
	.text("("+tennisMatch.year+" "+tennisMatch.tournament+" "+tennisMatch.round+")");
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[key] = value;
    });
    return vars;
}