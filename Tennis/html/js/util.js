function play(){
	var numOfSets=tennisMatch.host+tennisMatch.guest;
	var delayTime=0;
	var durationTime=1000;
	var report1 = svgLegend.select("#report1");
	for(i=0;i<numOfSets;i++){
		svgs[i].selectAll("circle").transition().style("fill","white").delay(delayTime).duration(durationTime);
	}
	for(k=0;k<numOfSets;k++){
		for(j=0;j<dataSet[k].numOfPoints;j++){
			dataSet[k].player1.points[j].enabled = 0;
			dataSet[k].player2.points[j].enabled = 0;
		}
	}
	for(i=0;i<tennisMatch.CMs.length;i++){
		delayTime += durationTime;
		//console.log(tennisMatch.matchReport[i]);
		if(tennisMatch.CMs[i].people == 0){
			dataSet[tennisMatch.CMs[i].setNO].player1.points[tennisMatch.CMs[i].seq].enabled = 1;
			var cm1 = svgs[tennisMatch.CMs[i].setNO].selectAll("circle.host").data(dataSet[tennisMatch.CMs[i].setNO].player1.points);
			cm1.transition().delay(delayTime).duration(durationTime)
			.style("fill",function(d){if(d.enabled == 1) return "red"; return "white"});
			report1.text(tennisMatch.matchReport[i]);
			dataSet[tennisMatch.CMs[i].setNO].player1.points[tennisMatch.CMs[i].seq].enabled = 0;
			cm1.transition().delay(delayTime+durationTime).duration(0)
			.style("fill",function(d){return "white"});
			report1.text("");
		}
		else{
			dataSet[tennisMatch.CMs[i].setNO].player2.points[tennisMatch.CMs[i].seq].enabled = 1;
			var cm2 = svgs[tennisMatch.CMs[i].setNO].selectAll("circle.guest").data(dataSet[tennisMatch.CMs[i].setNO].player1.points);
			cm2.transition().delay(delayTime).duration(durationTime)
			.style("fill",function(d){if(d.enabled == 1) return "blue"; return "white"})
			//report1.transition().delay(delayTime).duration(durationTime).text(tennisMatch.matchReport[i]);
			dataSet[tennisMatch.CMs[i].setNO].player2.points[tennisMatch.CMs[i].seq].enabled = 0;
			cm2.transition().delay(delayTime+durationTime).duration(0)
			.style("fill",function(d){return "white"});
			report1.transition().delay(delayTime).duration(durationTime).text("");
		} 
	}
}

function data_update(){ 					
	var numOfSets=tennisMatch.host+tennisMatch.guest;
	for(k=0;k<24;k++){
		stats[k].hostsum = 0;
		stats[k].guestsum = 0;		
	}
	for(i=0;i<numOfSets;i++){
		svgs[i].select("#status"+i).remove();
		//alert("#status"+i);
		var txt = svgs[i].append("text")
			.attr("id","status"+i)
      		.attr("x",width_axe)
      		.attr("y", ($("#content").height()-14-20)/numOfSets - height_yaxe + 20);
		for(k=0;k<24;k++){
			stats[k].hostcount = 0;
			stats[k].guestcount = 0;
		}
		for(j=0;j<dataSet[i].numOfPoints;j++){
			dataSet[i].player1.points[j].enabled = 0;
			dataSet[i].player2.points[j].enabled = 0;
			if(svgCharacter[0]==1){
				if(dataSet[i].player1.points[j].ace==1){
					stats[0].hostcount ++;
					stats[0].hostsum ++;
					if(svgPeople[0]==1){
						dataSet[i].player1.points[j].enabled = 1;
					}
				}
				else if(dataSet[i].player2.points[j].ace==1){
					stats[0].guestcount ++;
					stats[0].guestsum ++;
					if(svgPeople[1]==1){
						dataSet[i].player2.points[j].enabled = 1;
					}
				}
			}
			if(svgCharacter[1]==1){
				if(dataSet[i].player1.points[j].firstServingFault==1){
					stats[1].hostcount ++;
					stats[1].hostsum ++;
					if(svgPeople[0]==1){
						dataSet[i].player1.points[j].enabled = 1;
					}
				}
				else if(dataSet[i].player2.points[j].firstServingFault==1){
					stats[1].guestcount ++;
					stats[1].guestsum ++;
					if(svgPeople[1]==1){
						dataSet[i].player2.points[j].enabled = 1;
					}
				}
			}
			if(svgCharacter[2]==1){
				if(dataSet[i].player1.points[j].doubleFault==1){
					stats[2].hostcount ++;
					stats[2].hostsum ++;
					if(svgPeople[0]==1){
						dataSet[i].player1.points[j].enabled = 1;
					}
				}
				else if(dataSet[i].player2.points[j].doubleFault==1){
					stats[2].guestcount ++;
					stats[2].guestsum ++;
					if(svgPeople[1]==1){
						dataSet[i].player2.points[j].enabled = 1;
					}
				}
			}
			if(svgCharacter[3]==1){
				if(dataSet[i].player1.points[j].fhtopspin==1){
					stats[3].hostcount ++;
					stats[3].hostsum ++;
					if(svgPeople[0]==1){
						dataSet[i].player1.points[j].enabled = 1;
					}
				}
				if(dataSet[i].player2.points[j].fhtopspin==1){
					stats[3].guestcount ++;
					stats[3].guestsum ++;
					if(svgPeople[1]==1){
						dataSet[i].player2.points[j].enabled = 1;
					}
				}
			}
			if(svgCharacter[4]==1){
				if(dataSet[i].player1.points[j].bhtopspin==1){
					stats[4].hostcount ++;
					stats[4].hostsum ++;
					if(svgPeople[0]==1){
						dataSet[i].player1.points[j].enabled = 1;
					}
				}
				if(dataSet[i].player2.points[j].bhtopspin==1){
					stats[4].guestcount ++;
					stats[4].guestsum ++;
					if(svgPeople[1]==1){
						dataSet[i].player2.points[j].enabled = 1;
					}
				}
			}
			if(svgCharacter[5]==1){
				if(dataSet[i].player1.points[j].fhslice==1){
					stats[5].hostcount ++;
					stats[5].hostsum ++;
					if(svgPeople[0]==1){
						dataSet[i].player1.points[j].enabled = 1;
					}
				}
				if(dataSet[i].player2.points[j].fhslice==1){
					stats[5].guestcount ++;
					stats[5].guestsum ++;
					if(svgPeople[1]==1){
						dataSet[i].player2.points[j].enabled = 1;
					}
				}
			}
			if(svgCharacter[6]==1){
				if(dataSet[i].player1.points[j].bhslice==1){
					stats[6].hostcount ++;
					stats[6].hostsum ++;
					if(svgPeople[0]==1){
						dataSet[i].player1.points[j].enabled = 1;
					}
				}
				if(dataSet[i].player2.points[j].bhslice==1){
					stats[6].guestcount ++;
					stats[6].guestsum ++;
					if(svgPeople[1]==1){
						dataSet[i].player2.points[j].enabled = 1;
					}
				}
			}
			if(svgCharacter[7]==1){
				if(dataSet[i].player1.points[j].volley==1){
					console.log("i="+i+" j="+j);
					stats[7].hostcount ++;
					stats[7].hostsum ++;
					if(svgPeople[0]==1){
						dataSet[i].player1.points[j].enabled = 1;
					}
				}
				if(dataSet[i].player2.points[j].volley==1){
					stats[7].guestcount ++;
					stats[7].guestsum ++;
					if(svgPeople[1]==1){
						dataSet[i].player2.points[j].enabled = 1;
					}
				}
			}
			if(svgCharacter[8]==1){
				if(dataSet[i].player1.points[j].smash==1){
					stats[8].hostcount ++;
					stats[8].hostsum ++;
					if(svgPeople[0]==1){
						dataSet[i].player1.points[j].enabled = 1;
					}
				}
				if(dataSet[i].player2.points[j].smash==1){
					stats[8].guestcount ++;
					stats[8].guestsum ++;
					if(svgPeople[1]==1){
						dataSet[i].player2.points[j].enabled = 1;
					}
				}
			}	
			if(svgCharacter[9]==1){
				if(dataSet[i].player1.points[j].dropshot==1){
					stats[9].hostcount ++;
					stats[9].hostsum ++;
					if(svgPeople[0]==1){
						dataSet[i].player1.points[j].enabled = 1;
					}
				}
				if(dataSet[i].player2.points[j].dropshot==1){
					stats[9].guestcount ++;
					stats[9].guestsum ++;
					if(svgPeople[1]==1){
						dataSet[i].player2.points[j].enabled = 1;
					}
				}
			}
			if(svgCharacter[10]==1){
				if(dataSet[i].player1.points[j].lob==1){
					stats[10].hostcount ++;
					stats[10].hostsum ++;
					if(svgPeople[0]==1){
						dataSet[i].player1.points[j].enabled = 1;
					}
				}
				if(dataSet[i].player2.points[j].lob==1){
					stats[10].guestcount ++;
					stats[10].guestsum ++;
					if(svgPeople[1]==1){
						dataSet[i].player2.points[j].enabled = 1;
					}
				}
			}	
			if(svgCharacter[11]==1){
				if(dataSet[i].player1.points[j].hvolley==1){
					stats[11].hostcount ++;
					stats[11].hostsum ++;
					if(svgPeople[0]==1){
						dataSet[i].player1.points[j].enabled = 1;
					}
				}
				if(dataSet[i].player2.points[j].hvolley==1){
					stats[11].guestcount ++;
					stats[11].guestsum ++;
					if(svgPeople[1]==1){
						dataSet[i].player2.points[j].enabled = 1;
					}
				}
			}
			if(svgCharacter[12]==1){
				if(dataSet[i].player1.points[j].svolley==1){
					stats[12].hostcount ++;
					stats[12].hostsum ++;
					if(svgPeople[0]==1){
						dataSet[i].player1.points[j].enabled = 1;
					}
				}
				if(dataSet[i].player2.points[j].svolley==1){
					stats[12].guestcount ++;
					stats[12].guestsum ++;
					if(svgPeople[1]==1){
						dataSet[i].player2.points[j].enabled = 1;
					}
				}
			}
			if(svgCharacter[13]==1){
				if(dataSet[i].player1.points[j].winner==1){
					stats[13].hostcount ++;
					stats[13].hostsum ++;
					if(svgPeople[0]==1){
						dataSet[i].player1.points[j].enabled = 1;
					}
				}
				else if(dataSet[i].player2.points[j].winner==1){
					stats[13].guestcount ++;
					stats[13].guestsum ++;
					if(svgPeople[1]==1){
						dataSet[i].player2.points[j].enabled = 1;
					}
				}
			}
			if(svgCharacter[14]==1){
				if(dataSet[i].player1.points[j].ue==1){
					stats[14].hostcount ++;
					stats[14].hostsum ++;
					if(svgPeople[0]==1){
						dataSet[i].player1.points[j].enabled = 1;
					}
				}
				else if(dataSet[i].player2.points[j].ue==1){
					stats[14].guestcount ++;
					stats[14].guestsum ++;
					if(svgPeople[1]==1){
						dataSet[i].player2.points[j].enabled = 1;
					}
				}
			}
			if(svgCharacter[15]==1){
				if(dataSet[i].player1.points[j].fe==1){
					stats[15].hostcount ++;
					stats[15].hostsum ++;
					if(svgPeople[0]==1){
						dataSet[i].player1.points[j].enabled = 1;
					}
				}
				else if(dataSet[i].player2.points[j].fe==1){
					stats[15].guestcount ++;
					stats[15].guestsum ++;
					if(svgPeople[1]==1){
						dataSet[i].player2.points[j].enabled = 1;
					}
				}
			}
			if(svgCharacter[16]==1){
				if(dataSet[i].player1.points[j].rally>=slidevalue){
					stats[16].hostcount ++;
					stats[16].hostsum ++;
					if(svgPeople[0]==1){
						dataSet[i].player1.points[j].enabled = 1;
					}
				}
				if(dataSet[i].player2.points[j].rally>=slidevalue){
					stats[16].guestcount ++;
					stats[16].guestsum ++;
					if(svgPeople[1]==1){
						dataSet[i].player2.points[j].enabled = 1;
					}
				}
			}
			if(svgCharacter[17]==1){
				if(dataSet[i].player1.points[j].wide==1){
					stats[17].hostcount ++;
					stats[17].hostsum ++;
					if(svgPeople[0]==1){
						dataSet[i].player1.points[j].enabled = 1;
					}
				}
				else if(dataSet[i].player2.points[j].wide==1){
					stats[17].guestcount ++;
					stats[17].guestsum ++;
					if(svgPeople[1]==1){
						dataSet[i].player2.points[j].enabled = 1;
					}
				}
			}
			if(svgCharacter[18]==1){
				if(dataSet[i].player1.points[j].body==1){
					stats[18].hostcount ++;
					stats[18].hostsum ++;
					if(svgPeople[0]==1){
						dataSet[i].player1.points[j].enabled = 1;
					}
				}
				else if(dataSet[i].player2.points[j].body==1){
					stats[18].guestcount ++;
					stats[18].guestsum ++;
					if(svgPeople[1]==1){
						dataSet[i].player2.points[j].enabled = 1;
					}
				}
			}
			if(svgCharacter[19]==1){
				if(dataSet[i].player1.points[j].downthet==1){
					stats[19].hostcount ++;
					stats[19].hostsum ++;
					if(svgPeople[0]==1){
						dataSet[i].player1.points[j].enabled = 1;
					}
				}
				else if(dataSet[i].player2.points[j].downthet==1){
					stats[19].guestcount ++;
					stats[19].guestsum ++;
					if(svgPeople[1]==1){
						dataSet[i].player2.points[j].enabled = 1;
					}
				}
			}
			if(svgCharacter[20]==1){
				if(dataSet[i].player1.points[j].bpoints==1){
					stats[20].hostcount ++;
					stats[20].hostsum ++;
					if(svgPeople[0]==1){
						dataSet[i].player1.points[j].enabled = 1;
					}
				}
				else if(dataSet[i].player2.points[j].bpoints==1){
					stats[20].guestcount ++;
					stats[20].guestsum ++;
					if(svgPeople[1]==1){
						dataSet[i].player2.points[j].enabled = 1;
					}
				}
			}
			if(svgCharacter[21]==1){
				if(dataSet[i].player1.points[j].gpoints==1){
					stats[21].hostcount ++;
					stats[21].hostsum ++;
					if(svgPeople[0]==1){
						dataSet[i].player1.points[j].enabled = 1;
					}
				}
				else if(dataSet[i].player2.points[j].gpoints==1){
					stats[21].guestcount ++;
					stats[21].guestsum ++;
					if(svgPeople[1]==1){
						dataSet[i].player2.points[j].enabled = 1;
					}
				}
			}
			if(svgCharacter[22]==1){
				if(dataSet[i].player1.points[j].spoints==1){
					stats[22].hostcount ++;
					stats[22].hostsum ++;
					if(svgPeople[0]==1){
						dataSet[i].player1.points[j].enabled = 1;
					}
				}
				else if(dataSet[i].player2.points[j].spoints==1){
					stats[22].guestcount ++;
					stats[22].guestsum ++;
					if(svgPeople[1]==1){
						dataSet[i].player2.points[j].enabled = 1;
					}
				}
			}
			if(svgCharacter[23]==1){
				if(dataSet[i].player1.points[j].mpoints==1){
					stats[23].hostcount ++;
					stats[23].hostsum ++;
					if(svgPeople[0]==1){
						dataSet[i].player1.points[j].enabled = 1;
					}
				}
				else if(dataSet[i].player2.points[j].mpoints==1){
					stats[23].guestcount ++;
					stats[23].guestsum ++;
					if(svgPeople[1]==1){
						dataSet[i].player2.points[j].enabled = 1;
					}
				}
			}
			if(svgCharacter[24]==1){
				if(svgPeople[0]==1){
					dataSet[i].player1.points[j].enabled = 1;
				}
				if(svgPeople[1]==1){
					dataSet[i].player2.points[j].enabled = 1;
				}
			}
			if(dataSet[i].player1.points[j].enabled == 1 && dataSet[i].player2.points[j].enabled ==1 && dataSet[i].player1.points[j].cy == dataSet[i].player2.points[j].cy) {
				dataSet[i].player1.points[j].enabled = 3;
				dataSet[i].player2.points[j].enabled = 3;
			}
			else if(dataSet[i].player1.points[j].enabled == 0 && dataSet[i].player2.points[j].enabled ==1 && dataSet[i].player1.points[j].cy == dataSet[i].player2.points[j].cy) {
				dataSet[i].player1.points[j].enabled = 4;
				dataSet[i].player2.points[j].enabled = 4;
			}
			else if(dataSet[i].player1.points[j].enabled == 1 && dataSet[i].player2.points[j].enabled ==0 && dataSet[i].player1.points[j].cy == dataSet[i].player2.points[j].cy) {
				dataSet[i].player1.points[j].enabled = 5;
				dataSet[i].player2.points[j].enabled = 5;
			}
			else if(dataSet[i].player1.points[j].enabled == 0 && dataSet[i].player2.points[j].enabled ==0 && dataSet[i].player1.points[j].cy == dataSet[i].player2.points[j].cy) {
				dataSet[i].player1.points[j].enabled = 6;
				dataSet[i].player2.points[j].enabled = 6;
			}
		}
		for(k=17;k<20;k++){
			if(svgCharacter[k] == 1){
				txt.append("svg:tspan").style("fill", "black").text(charName[k]+"\u00A0\u00A0");
				txt.append("svg:tspan").style("fill", "blue").text(stats[k].hostcount);
				txt.append("svg:tspan").style("fill", "black").text(":");
  				txt.append("svg:tspan").style("fill", "red").text(stats[k].guestcount+"\u00A0\u00A0\u00A0");			
			}
		}
		for(k=0;k<16;k++){
			if(svgCharacter[k] == 1){
				txt.append("svg:tspan")
				.style("fill", "black")
				.attr("font-size","10pt")
				.attr("font-family","Arial, Helvetica, sans-serif")
				.text(charName[k]+"\u00A0\u00A0");
				
				txt.append("svg:tspan")
				.style("fill", "blue")
				.attr("font-size","10pt")
				.attr("font-family","Arial, Helvetica, sans-serif")
				.text(stats[k].hostcount);
				
				txt.append("svg:tspan")
				.style("fill", "black")
				.attr("font-size","10pt")
				.attr("font-family","Arial, Helvetica, sans-serif")
				.text(":");
				
  				txt.append("svg:tspan")
  				.style("fill", "red")
  				.attr("font-size","10pt")
				.attr("font-family","Arial, Helvetica, sans-serif")
  				.text(stats[k].guestcount+"\u00A0\u00A0\u00A0");			
			}
		}
		if(svgCharacter[16] == 1){
			txt.append("svg:tspan")
			.style("fill", "black")
			.attr("font-size","10pt")
			.attr("font-family","Arial, Helvetica, sans-serif")
			.text("Rally >="+slidevalue+"\u00A0\u00A0");
			
			txt.append("svg:tspan")
			.style("fill", "black")
			.attr("font-size","10pt")
			.attr("font-family","Arial, Helvetica, sans-serif")
			.text(stats[16].hostcount+"\u00A0\u00A0\u00A0");
			
		}
		for(k=20;k<24;k++){
			if(svgCharacter[k] == 1){
				txt.append("svg:tspan")
				.style("fill", "black")
				.attr("font-size","10pt")
				.attr("font-family","Arial, Helvetica, sans-serif")
				.text(charName[k]+"\u00A0\u00A0");
				
				txt.append("svg:tspan")
				.style("fill", "blue")
				.attr("font-size","10pt")
				.attr("font-family","Arial, Helvetica, sans-serif")
				.text(stats[k].hostcount);
				
				txt.append("svg:tspan")
				.attr("font-size","10pt")
				.attr("font-family","Arial, Helvetica, sans-serif")
				.style("fill", "black")
				.text(":");
  				
  				txt.append("svg:tspan")
  				.attr("font-size","10pt")
				.attr("font-family","Arial, Helvetica, sans-serif")
  				.style("fill", "red").text(stats[k].guestcount+"\u00A0\u00A0\u00A0");			
			}
		}
	}	
}

function svg_update(index){
	
	svgs[index].selectAll("circle").transition().style("fill","white").delay(0).duration(100);
	
	var points1=svgs[index].selectAll("circle.host").data(dataSet[index].player1.points);	
	var points2=svgs[index].selectAll("circle.guest").data(dataSet[index].player2.points);	

	if(svgCharacter[24] == 1 && svgPeople[0] == 1 && svgPeople[1] == 1){
		points1.transition().delay(500).duration(100)
		.style("stroke", function(d){return d.tie2;})
		.style("fill", function(d){return d.tie1;});
		points2.transition().delay(500).duration(100)
		.style("stroke", function(d){return d.tie2;})
		.style("fill", function(d){return d.tie1;});
	}
	else{
		points1.transition().delay(500).duration(100)
		.style("stroke", function(d){if(d.enabled == 1 || d.enabled == 5) return "blue";if(d.enabled == 0) return "blue"; if(d.enabled == 6) return "green";if(d.enabled == 3 ) return "green"; return "red";})
		.style("fill", function(d){if(d.enabled == 1 || d.enabled == 5) return "blue";if(d.enabled == 0 || d.enabled == 6) return "white";if(d.enabled == 3 ) return "green"; return "red";})
		points2.transition().delay(500).duration(100)
		.style("stroke", function(d){if(d.enabled == 1 || d.enabled == 4) return "red";if(d.enabled == 0) return "red"; if(d.enabled == 6) return "green";if(d.enabled == 3 ) return "green"; return "blue";})
		.style("fill", function(d){if(d.enabled == 1 || d.enabled == 4) return "red";if(d.enabled == 0 || d.enabled == 6) return "white";if(d.enabled == 3 ) return "green"; return "blue";})
	}
}

/*
function svg_p1_disappear(points){
	points.transition().duration(100) 
	.style("fill", function(d){if(d.enabled >=1) return "white";})
}
function svg_p1_appear(points){
	points.transition().duration(100)
	.style("fill", function(d){if(d.enabled >= 1) return "blue" else if (d.enreturn "green";})
}
function svg_p2_disappear(points){
	points.transition().duration(100)
	.attr("class","guest")
	.attr("cx", function(d, j) { return d.cx; })    
	.attr("cy", function(d, j) { return d.cy; }) 
	.style("stroke", function(d){if(d.enabled == 1) return "red";return "green";})
	.style("fill", function(d){if(d.enabled == 1) return "red";return "green";})
}
function svg_p2_appear(points){
}

function svg_animation(index){

	var points1=svgs[index].selectAll("circle.host").data(dataSet[index].player1.points);	
	if(svgPeople[0]==1){
		for(i=1;i<=10;i++){
			svg_p1_disappear(points1);	
			svg_p1_appear(points1);	
		}
	}
	var points2=svgs[index].selectAll("circle.guest").data(dataSet[index].player2.points);	
	if(svgPeople[1]==1){

	}
}
*/

function transform(people,character){
	var i;
	svgPeople=people;
	svgCharacter=character;
	data_update();
	//console.log(dataSet);
	for(i=0;i<numOfSvgs;i++){
		svg_update(i);
	}
}

function initData(){
	//console.log(tennisMatch);
	var div_height=$("#content").height() - 14 - 20;
	var div_width=$("#content").width();
	$("svg").remove();
	svgs=[];
	var numOfSets=tennisMatch.host+tennisMatch.guest;
	numOfSvgs = numOfSets;
	
	var i,j,k;
	var prex,prey1,prey2;
	var x,y1,y2;

	//alert(tennisMatch.sets[0].games[0].start);
	$("#time").text(tennisMatch.date);
	maxRally = tennisMatch.maxRally;
	for(i=0;i<numOfSvgs;i++){
		dataSet[i]=new Object();
		dataSet[i].rect=[];
		dataSet[i].scoreboard=[];
		dataSet[i].breakpoints = [];
		dataSet[i].player1=new Object();
		dataSet[i].player2=new Object();
		dataSet[i].player1.points=[];
		dataSet[i].player1.lines=[];
		dataSet[i].player2.points=[];
		dataSet[i].player2.lines=[];
	}
	//var setScores = [];
	var setShots = [];
	var minSpace = 10000000;
	var setWidth = [];
	for(i=0;i<numOfSets;i++){
		/* calculate minSpace by points
		var numOfGames=tennisMatch.sets[i].host+tennisMatch.sets[i].guest;
		var numOfScores=0;
		for(j=0;j<numOfGames;j++){
			numOfScores=numOfScores+tennisMatch.sets[i].games[j].scores.length;
		}
		//console.log(i+"="+numOfScores);
		setScores.push(numOfScores);
		var tmpSpace = (tennisMatch.sets[i].games[tennisMatch.sets[i].host+tennisMatch.sets[i].guest-1].tiebreak == 1)? (div_width - width_axe - width_axe2)/numOfScores:(div_width - width_axe - 10)/numOfScores;
		setWidth.push(tmpSpace);
		if(tmpSpace <minSpace){
			minSpace = tmpSpace;
		}
		*/
		// calculate minSpace by shots
		var numOfGames=tennisMatch.sets[i].host+tennisMatch.sets[i].guest;
		var numOfShots=0;
		var numOfScores=0;
		for(j=0;j<numOfGames;j++){
			numOfScores=numOfScores+tennisMatch.sets[i].games[j].scores.length;
		}
		for(j=0;j<numOfGames;j++){
			for(k=0;k<tennisMatch.sets[i].games[j].scores.length;k++){
				numOfShots += tennisMatch.sets[i].games[j].scores[k].rally;
			}
		}
		numOfShots += (numOfScores * 10);
		//console.log("numOfShots="+numOfShots);
		setShots.push(numOfShots);
		var tmpSpace = (tennisMatch.sets[i].games[tennisMatch.sets[i].host+tennisMatch.sets[i].guest-1].tiebreak == 1)? (div_width - width_axe - width_axe2)/numOfShots:(div_width - width_axe - 10)/numOfShots;
		setWidth.push(tmpSpace);
		if(tmpSpace <minSpace){
			minSpace = tmpSpace;
		}
	}
	var numOfBreakPoints = 0;
	for(i=0;i<numOfSets;i++){	
		numOfBreakPoints = 0;
		var svg = d3.select("#content").append("svg")
		.attr("width", div_width)
		.attr("height", div_height/numOfSets).style("border","0px solid black");
		svgs.push(svg);
		if(tennisMatch.sets[i].games[tennisMatch.sets[i].host+tennisMatch.sets[i].guest-1].tiebreak == 1){
			//drawAxis(svg,div_width,div_height/numOfSets,setShots[i],i,tennisMatch,1);		
			drawAxis(svg,div_width,div_height/numOfSets,setShots[i],i,tennisMatch,1,minSpace,setWidth[i],numOfScores);		
		}
		else{
			//drawAxis(svg,div_width,div_height/numOfSets,setShots[i],i,tennisMatch,0);
			drawAxis(svg,div_width,div_height/numOfSets,setShots[i],i,tennisMatch,0,minSpace,setWidth[i],numOfScores);
		}
		var numOfGames=tennisMatch.sets[i].host+tennisMatch.sets[i].guest;
		var numOfPoints=0;
		var numOfLines=0;
		var posY=0;
		if(tennisMatch.sets[i].games[tennisMatch.sets[i].host+tennisMatch.sets[i].guest-1].tiebreak == 1){
			posY = yscale2(8)+height_axe-1;
		}
		else{
			posY = yscale(60)+height_axe-1;
		}
		var currentShot = 0;
		for(j=0;j<numOfGames;j++){
			//var posX=xtime(format.parse(tennisMatch.sets[i].games[j].start))+width_axe;
			//var width=xtime(format.parse(tennisMatch.sets[i].games[j].end))+width_axe;
			//var posX=xscale(tennisMatch.sets[i].games[j].startShot+tennisMatch.sets[i].games[j].start*6)*minSpace/setWidth[i]+width_axe; 
			//var width=xscale(tennisMatch.sets[i].games[j].endShot+tennisMatch.sets[i].games[j].end*6)*minSpace/setWidth[i]+width_axe;
			var posX=xscale(tennisMatch.sets[i].games[j].startShot+tennisMatch.sets[i].games[j].start*10)+width_axe; 
			var width=xscale(tennisMatch.sets[i].games[j].endShot+tennisMatch.sets[i].games[j].end*10)+width_axe;
			//console.log("posX="+posX+" width="+width);
			dataSet[i].rect[j]=new Object();
			dataSet[i].rect[j].x=posX;
			dataSet[i].rect[j].y=posY;
			dataSet[i].rect[j].width=(width-posX);
			dataSet[i].rect[j].height=(div_height/numOfSets-height_yaxe-height_axe);
			dataSet[i].scoreboard[j] = new Object();
			dataSet[i].scoreboard[j].x = posX;
			dataSet[i].scoreboard[j].y = posY - 3;
			dataSet[i].scoreboard[j].score1 = tennisMatch.sets[i].games[j].host1;	
			//dataSet[i].scoreboard[j].x1 = 1;	
			//console.log("host="+tennisMatch.sets[i].games[j].host);				
			dataSet[i].scoreboard[j].score2 = tennisMatch.sets[i].games[j].guest1;						
			if(tennisMatch.sets[i].games[j].tiebreak == 1){
				dataSet[i].rect[j].fill = "#ccffcc";
			}
			else if(tennisMatch.sets[i].games[j].serving==0){
				dataSet[i].rect[j].fill="#E6E6FF";
			}
			else{
				dataSet[i].rect[j].fill="#FFEBF5";
			}
			for(k=0;k<tennisMatch.sets[i].games[j].scores.length;k++){	
				currentShot += tennisMatch.sets[i].games[j].scores[k].rally;
				//x=xscale(currentShot+tennisMatch.sets[i].games[j].scores[k].seq*6)*minSpace/setWidth[i]+width_axe;
				x=xscale(currentShot+tennisMatch.sets[i].games[j].scores[k].seq*10)+width_axe;
				if(tennisMatch.sets[i].games[j].tiebreak == 1){
					y1=yscale2(tennisMatch.sets[i].games[j].scores[k].host)+height_axe;
					y2=yscale2(tennisMatch.sets[i].games[j].scores[k].guest)+height_axe;
				}
				else{
					y1=yscale(tennisMatch.sets[i].games[j].scores[k].host)+height_axe;
					y2=yscale(tennisMatch.sets[i].games[j].scores[k].guest)+height_axe;
				}	
				//console.log("y1="+y1+" y2="+y2);		
				dataSet[i].player1.points[numOfPoints]= new Object();
				dataSet[i].player1.points[numOfPoints].cy = y1;
				if(tennisMatch.sets[i].games[j].tiebreak == 1){
					dataSet[i].player1.points[numOfPoints].tiebreak = 1;
				}
				else{
					dataSet[i].player1.points[numOfPoints].tiebreak = 0;
					if(k == tennisMatch.sets[i].games[j].scores.length - 1 && tennisMatch.sets[i].games[j].scores[k].winner != tennisMatch.sets[i].games[j].scores[k].serving){
						dataSet[i].breakpoints[numOfBreakPoints] = new Object;
						dataSet[i].breakpoints[numOfBreakPoints].x = x - 3;
						dataSet[i].breakpoints[numOfBreakPoints].y = (y1 > y2)?y2:y1 - 3;
						dataSet[i].breakpoints[numOfBreakPoints].color = tennisMatch.sets[i].games[j].scores[k].serving == 0 ? "red" : "blue";
						numOfBreakPoints ++;
					}
				}
				dataSet[i].player1.points[numOfPoints].cx=x;
				dataSet[i].player1.points[numOfPoints].hoffset=tennisMatch.sets[i].games[j].scores[k].hoffset;				
				dataSet[i].player1.points[numOfPoints].moffset=tennisMatch.sets[i].games[j].scores[k].moffset;				
				dataSet[i].player1.points[numOfPoints].soffset=tennisMatch.sets[i].games[j].scores[k].soffset;				
				dataSet[i].player1.points[numOfPoints].comments=tennisMatch.sets[i].games[j].scores[k].comments;
				if(tennisMatch.sets[i].games[j].scores[k].host == tennisMatch.sets[i].games[j].scores[k].guest && tennisMatch.sets[i].games[j].scores[k].winner == 1){
					dataSet[i].player1.points[numOfPoints].tie1 = "red";
					dataSet[i].player1.points[numOfPoints].tie2 = "red";
				}
				else if(tennisMatch.sets[i].games[j].scores[k].winner == 0){
					dataSet[i].player1.points[numOfPoints].tie1 = "blue";
					dataSet[i].player1.points[numOfPoints].tie2 = "blue";
				}
				else {
					dataSet[i].player1.points[numOfPoints].tie1 = "white";				
					dataSet[i].player1.points[numOfPoints].tie2 = "blue";				
				}
				if(tennisMatch.sets[i].games[j].scores[k].serveDirection==4 && tennisMatch.sets[i].games[j].scores[k].serving==0){
					dataSet[i].player1.points[numOfPoints].wide=1;				
				}
				else{
					dataSet[i].player1.points[numOfPoints].wide=0;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].serveDirection==5 && tennisMatch.sets[i].games[j].scores[k].serving==0){
					dataSet[i].player1.points[numOfPoints].body=1;				
				}
				else{
					dataSet[i].player1.points[numOfPoints].body=0;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].serveDirection==6 && tennisMatch.sets[i].games[j].scores[k].serving==0){
					dataSet[i].player1.points[numOfPoints].downthet=1;				
				}
				else{
					dataSet[i].player1.points[numOfPoints].downthet=0;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].ace==true && tennisMatch.sets[i].games[j].scores[k].serving==0){
					dataSet[i].player1.points[numOfPoints].ace=1;				
				}
				else{
					dataSet[i].player1.points[numOfPoints].ace=0;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].firstServingFault==true&& tennisMatch.sets[i].games[j].scores[k].serving==0){
					dataSet[i].player1.points[numOfPoints].firstServingFault=1;				
				}
				else{
					dataSet[i].player1.points[numOfPoints].firstServingFault=0;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].doubleFaults==true&& tennisMatch.sets[i].games[j].scores[k].serving==0){
					dataSet[i].player1.points[numOfPoints].doubleFault=1;				
				}
				else{
					dataSet[i].player1.points[numOfPoints].doubleFault=0;				
				}
				if((tennisMatch.sets[i].games[j].scores[k].error==3 && tennisMatch.sets[i].games[j].scores[k].rally % 2 == 1 && tennisMatch.sets[i].games[j].scores[k].serving ==0) ||(tennisMatch.sets[i].games[j].scores[k].error==1 && tennisMatch.sets[i].games[j].scores[k].rally % 2 == 0 && tennisMatch.sets[i].games[j].scores[k].serving ==1)){
					dataSet[i].player1.points[numOfPoints].winner=1;				
				}
				else if((tennisMatch.sets[i].games[j].scores[k].error==1 && tennisMatch.sets[i].games[j].scores[k].rally % 2 == 1 && tennisMatch.sets[i].games[j].scores[k].serving ==0) ||(tennisMatch.sets[i].games[j].scores[k].error==1 && tennisMatch.sets[i].games[j].scores[k].rally % 2 == 0 && tennisMatch.sets[i].games[j].scores[k].serving ==1)){
					dataSet[i].player1.points[numOfPoints].ue=1;				
				}
				else if((tennisMatch.sets[i].games[j].scores[k].error==2 && tennisMatch.sets[i].games[j].scores[k].rally % 2 == 1 && tennisMatch.sets[i].games[j].scores[k].serving ==0) ||(tennisMatch.sets[i].games[j].scores[k].error==2 && tennisMatch.sets[i].games[j].scores[k].rally % 2 == 0 && tennisMatch.sets[i].games[j].scores[k].serving ==1)){
					dataSet[i].player1.points[numOfPoints].fe=1;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].fcount1 >0){
					dataSet[i].player1.points[numOfPoints].fhtopspin=1;				
				}
				else{
					dataSet[i].player1.points[numOfPoints].fhtopspin=0;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].bcount1 >0){
					dataSet[i].player1.points[numOfPoints].bhtopspin=1;				
				}
				else{
					dataSet[i].player1.points[numOfPoints].bhtopspin=0;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].rcount1 >0){
					dataSet[i].player1.points[numOfPoints].fhslice=1;				
				}
				else{
					dataSet[i].player1.points[numOfPoints].fhslice=0;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].scount1 >0){
					dataSet[i].player1.points[numOfPoints].bhslice=1;				
				}
				else{
					dataSet[i].player1.points[numOfPoints].bhslice=0;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].vcount1 + tennisMatch.sets[i].games[j].scores[k].zcount1 >0){
					dataSet[i].player1.points[numOfPoints].volley=1;				
				}
				else{
					dataSet[i].player1.points[numOfPoints].volley=0;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].ocount1 + tennisMatch.sets[i].games[j].scores[k].pcount1 >0){
					dataSet[i].player1.points[numOfPoints].smash=1;				
				}
				else{
					dataSet[i].player1.points[numOfPoints].smash=0;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].ucount1 + tennisMatch.sets[i].games[j].scores[k].ycount1 >0){
					dataSet[i].player1.points[numOfPoints].dropshot=1;				
				}
				else{
					dataSet[i].player1.points[numOfPoints].dropshot=0;				
				}	
				if(tennisMatch.sets[i].games[j].scores[k].lcount1 + tennisMatch.sets[i].games[j].scores[k].mcount1 >0){
					dataSet[i].player1.points[numOfPoints].lob=1;				
				}
				else{
					dataSet[i].player1.points[numOfPoints].lob=0;				
				}	
				if(tennisMatch.sets[i].games[j].scores[k].hcount1 + tennisMatch.sets[i].games[j].scores[k].icount1 >0){
					dataSet[i].player1.points[numOfPoints].hvolley=1;				
				}
				else{
					dataSet[i].player1.points[numOfPoints].hvolley=0;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].jcount1 + tennisMatch.sets[i].games[j].scores[k].kcount1 >0){
					dataSet[i].player1.points[numOfPoints].svolley=1;				
				}
				else{
					dataSet[i].player1.points[numOfPoints].svolley=0;				
				}
				dataSet[i].player1.points[numOfPoints].rally = tennisMatch.sets[i].games[j].scores[k].rally;		
				dataSet[i].player1.points[numOfPoints].bpoints = tennisMatch.sets[i].games[j].scores[k].bpoints1;		
				dataSet[i].player1.points[numOfPoints].gpoints = tennisMatch.sets[i].games[j].scores[k].gpoints1;		
				dataSet[i].player1.points[numOfPoints].spoints = tennisMatch.sets[i].games[j].scores[k].spoints1;		
				dataSet[i].player1.points[numOfPoints].mpoints = tennisMatch.sets[i].games[j].scores[k].mpoints1;		

				
				dataSet[i].player2.points[numOfPoints]= new Object();
				dataSet[i].player2.points[numOfPoints].cx=x;
				dataSet[i].player2.points[numOfPoints].hoffset=tennisMatch.sets[i].games[j].scores[k].hoffset;				
				dataSet[i].player2.points[numOfPoints].moffset=tennisMatch.sets[i].games[j].scores[k].moffset;				
				dataSet[i].player2.points[numOfPoints].soffset=tennisMatch.sets[i].games[j].scores[k].soffset;
				dataSet[i].player2.points[numOfPoints].cy=y2;
				if(tennisMatch.sets[i].games[j].tiebreak == 1){
					dataSet[i].player2.points[numOfPoints].tiebreak = 1;
				}
				else{
					dataSet[i].player2.points[numOfPoints].tiebreak = 0;
				}		
				dataSet[i].player2.points[numOfPoints].comments=tennisMatch.sets[i].games[j].scores[k].comments;

				if(tennisMatch.sets[i].games[j].scores[k].host == tennisMatch.sets[i].games[j].scores[k].guest && tennisMatch.sets[i].games[j].scores[k].winner == 0){
					dataSet[i].player2.points[numOfPoints].tie1 = "blue";
					dataSet[i].player2.points[numOfPoints].tie2 = "blue";
				}
				else if(tennisMatch.sets[i].games[j].scores[k].winner == 1){
					dataSet[i].player2.points[numOfPoints].tie1 = "red";
					dataSet[i].player2.points[numOfPoints].tie2 = "red";
				}
				else{
					dataSet[i].player2.points[numOfPoints].tie1 = "white";		
					dataSet[i].player2.points[numOfPoints].tie2 = "red";		
				}

				if(tennisMatch.sets[i].games[j].scores[k].serveDirection==4 && tennisMatch.sets[i].games[j].scores[k].serving==1){
					dataSet[i].player2.points[numOfPoints].wide=1;				
				}
				else{
					dataSet[i].player2.points[numOfPoints].wide=0;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].serveDirection==5 && tennisMatch.sets[i].games[j].scores[k].serving==1){
					dataSet[i].player2.points[numOfPoints].body=1;				
				}
				else{
					dataSet[i].player2.points[numOfPoints].body=0;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].serveDirection==6 && tennisMatch.sets[i].games[j].scores[k].serving==1){
					dataSet[i].player2.points[numOfPoints].downthet=1;				
				}
				else{
					dataSet[i].player2.points[numOfPoints].downthet=0;				
				}

				if(tennisMatch.sets[i].games[j].scores[k].ace==true && tennisMatch.sets[i].games[j].scores[k].serving==1){
					dataSet[i].player2.points[numOfPoints].ace=1;				
				}
				else{
					dataSet[i].player2.points[numOfPoints].ace=0;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].firstServingFault==true&& tennisMatch.sets[i].games[j].scores[k].serving==1){
					dataSet[i].player2.points[numOfPoints].firstServingFault=1;				
				}
				else{
					dataSet[i].player2.points[numOfPoints].firstServingFault=0;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].doubleFaults==true&& tennisMatch.sets[i].games[j].scores[k].serving==1){
					dataSet[i].player2.points[numOfPoints].doubleFault=1;				
				}
				else{
					dataSet[i].player2.points[numOfPoints].doubleFault=0;				
				}
				if((tennisMatch.sets[i].games[j].scores[k].error==3 && tennisMatch.sets[i].games[j].scores[k].rally % 2 == 0 && tennisMatch.sets[i].games[j].scores[k].serving ==0) ||(tennisMatch.sets[i].games[j].scores[k].error==1 && tennisMatch.sets[i].games[j].scores[k].rally % 2 == 1 && tennisMatch.sets[i].games[j].scores[k].serving ==1)){
					dataSet[i].player2.points[numOfPoints].winner=1;				
				}
				else if((tennisMatch.sets[i].games[j].scores[k].error==1 && tennisMatch.sets[i].games[j].scores[k].rally % 2 == 0 && tennisMatch.sets[i].games[j].scores[k].serving ==0) ||(tennisMatch.sets[i].games[j].scores[k].error==1 && tennisMatch.sets[i].games[j].scores[k].rally % 2 == 1 && tennisMatch.sets[i].games[j].scores[k].serving ==1)){
					dataSet[i].player2.points[numOfPoints].ue=1;				
				}
				else if((tennisMatch.sets[i].games[j].scores[k].error==2 && tennisMatch.sets[i].games[j].scores[k].rally % 2 == 0 && tennisMatch.sets[i].games[j].scores[k].serving ==0) ||(tennisMatch.sets[i].games[j].scores[k].error==2 && tennisMatch.sets[i].games[j].scores[k].rally % 2 == 1 && tennisMatch.sets[i].games[j].scores[k].serving ==1)){
					dataSet[i].player2.points[numOfPoints].fe=1;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].fcount2 >0){
					dataSet[i].player2.points[numOfPoints].fhtopspin=1;				
				}
				else{
					dataSet[i].player2.points[numOfPoints].fhtopspin=0;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].bcount2 >0){
					dataSet[i].player2.points[numOfPoints].bhtopspin=1;				
				}
				else{
					dataSet[i].player2.points[numOfPoints].bhtopspin=0;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].rcount2 >0){
					dataSet[i].player2.points[numOfPoints].fhslice=1;				
				}
				else{
					dataSet[i].player2.points[numOfPoints].fhslice=0;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].scount2 >0){
					dataSet[i].player2.points[numOfPoints].bhslice=1;				
				}
				else{
					dataSet[i].player2.points[numOfPoints].bhslice=0;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].vcount2 + tennisMatch.sets[i].games[j].scores[k].zcount2 >0){
					dataSet[i].player2.points[numOfPoints].volley=1;				
				}
				else{
					dataSet[i].player2.points[numOfPoints].volley=0;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].ocount2 + tennisMatch.sets[i].games[j].scores[k].pcount2 >0){
					dataSet[i].player2.points[numOfPoints].smash=1;				
				}
				else{
					dataSet[i].player2.points[numOfPoints].smash=0;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].ucount2 + tennisMatch.sets[i].games[j].scores[k].ycount2 >0){
					dataSet[i].player2.points[numOfPoints].dropshot=1;				
				}
				else{
					dataSet[i].player2.points[numOfPoints].dropshot=0;				
				}	
				if(tennisMatch.sets[i].games[j].scores[k].lcount2 + tennisMatch.sets[i].games[j].scores[k].mcount2 >0){
					dataSet[i].player2.points[numOfPoints].lob=1;				
				}
				else{
					dataSet[i].player2.points[numOfPoints].lob=0;				
				}	
				if(tennisMatch.sets[i].games[j].scores[k].hcount2 + tennisMatch.sets[i].games[j].scores[k].icount2 >0){
					dataSet[i].player2.points[numOfPoints].hvolley=1;				
				}
				else{
					dataSet[i].player2.points[numOfPoints].hvolley=0;				
				}
				if(tennisMatch.sets[i].games[j].scores[k].jcount2 + tennisMatch.sets[i].games[j].scores[k].kcount2 >0){
					dataSet[i].player2.points[numOfPoints].svolley=1;				
				}
				else{
					dataSet[i].player2.points[numOfPoints].svolley=0;				
				}
				dataSet[i].player2.points[numOfPoints].rally = tennisMatch.sets[i].games[j].scores[k].rally;
				dataSet[i].player2.points[numOfPoints].bpoints = tennisMatch.sets[i].games[j].scores[k].bpoints2;		
				dataSet[i].player2.points[numOfPoints].gpoints = tennisMatch.sets[i].games[j].scores[k].gpoints2;		
				dataSet[i].player2.points[numOfPoints].spoints = tennisMatch.sets[i].games[j].scores[k].spoints2;		
				dataSet[i].player2.points[numOfPoints].mpoints = tennisMatch.sets[i].games[j].scores[k].mpoints2;

				numOfPoints++;
				if(k!=0){
					dataSet[i].player1.lines[numOfLines]=new Object();
					dataSet[i].player1.lines[numOfLines].x1=prex
					dataSet[i].player1.lines[numOfLines].y1=prey1;
					dataSet[i].player1.lines[numOfLines].x2=x;
					dataSet[i].player1.lines[numOfLines].y2=y1;	

					dataSet[i].player2.lines[numOfLines]=new Object();							
					dataSet[i].player2.lines[numOfLines].x1=prex
					dataSet[i].player2.lines[numOfLines].y1=prey2;
					dataSet[i].player2.lines[numOfLines].x2=x;
					dataSet[i].player2.lines[numOfLines].y2=y2;	
					numOfLines++;	
				}
				prex=x;
				prey1=y1;
				prey2=y2;
			}	
			//currentShot += 5;
			dataSet[i].numOfLines=numOfLines;	
			dataSet[i].numOfPoints=numOfPoints;	
		}
	}
	//console.log(dataSet);
	paintLines();
	paintPoints();
	for(i=0;i<2;i++){
		svgPeople[i]=1;
	}
	svgCharacter[0]=0;
	svgCharacter[1]=0;
	svgCharacter[2]=0;
	svgCharacter[3]=0;	
	svgCharacter[4]=0;
	svgCharacter[5]=0;
	svgCharacter[6]=0;
	svgCharacter[7]=0;
	svgCharacter[8]=0;
	svgCharacter[9]=0;
	svgCharacter[10]=0;
	svgCharacter[11]=0;
	svgCharacter[12]=0;
	svgCharacter[13]=0;
	svgCharacter[14]=0;
	svgCharacter[15]=0;
	svgCharacter[16]=0;
	svgCharacter[17]=0;
	svgCharacter[18]=0;
	svgCharacter[19]=0;
	svgCharacter[20]=0;
	svgCharacter[21]=0;
	svgCharacter[22]=0;
	svgCharacter[23]=0;
	addTitle();
}

function paintLines(){
	//console.log(dataSet);
	var i;
	for(i=0;i<numOfSvgs;i++){
		var rects = svgs[i].selectAll("rect").data(dataSet[i].rect);	
		rects.enter().append("rect")
		.attr("x", function(d, j) { return d.x; })
		.attr("y", function(d, j) { return d.y; })
		.attr("fill",function(d, j) { return d.fill; })
		.attr("width", function(d, j) { return 0})
		.attr("height", function(d, j) { return 0});
		
		rects.transition().duration(1000)
		.attr("width", function(d, j) { return d.width; })
		.attr("height", function(d, j) { return d.height; });

		var scoreboards = svgs[i].selectAll("text.score").data(dataSet[i].scoreboard);	
		scoreboards.enter().append("text")
		.attr("x", function(d, j) { return d.x; })
		.attr("y", function(d, j) { return d.y; })
		.attr("class","score")
		.append("svg:tspan").style("fill", "blue").style("font-size","12px").text(function(d,j){return d.score1;})
		.append("svg:tspan").style("fill", "black").text(":")
		.append("svg:tspan").style("fill", "red").text(function(d,j){return d.score2;});

		var breakpoints = svgs[i].selectAll("text.breakpoint").data(dataSet[i].breakpoints);	
		// breakpoints.enter().append("rect")
		// .attr("x", function(d, j) { return d.x-3; })
		// .attr("y", function(d, j) { return d.y-13; })
		// .attr("class","breakpoint")
		// .attr("fill",function(d){return d.color;})
		// .attr("width", 8)
		// .attr("height", 8);

		breakpoints.enter().append("text")
		.attr("x", function(d, j) { return d.x-3; })
		.attr("y", function(d, j) { if(d.color == "red") return d.y-6; return d.y - 3; })
		.attr("class","breakpoint")
		.attr("fill",function(d){return d.color;})
		.text("B");
						
		var lines1 = svgs[i].selectAll("line.host").data(dataSet[i].player1.lines);	
		lines1.enter().append("line")
		.style("stroke", "blue") 
		.attr("class","host")
		.attr("x1", function(d, j) { return d.x1; })    
		.attr("y1", function(d, j) { return 0; })        
		.attr("x2", function(d, j) { return d.x2; })       
		.attr("y2", function(d, j) { return 0; });
		
		lines1.transition().delay(1000).duration(1000)
  		.attr("y1", function(d, j) { return d.y1; })        
		.attr("y2", function(d, j) { return d.y2; });

		var lines2 = svgs[i].selectAll("line.guest").data(dataSet[i].player2.lines);	
		lines2.enter().append("line")
		.style("stroke", "red") 
		.attr("class","guest")
		.attr("x1", function(d, j) { return d.x1; })    
		.attr("y1", function(d, j) { return 0; })        
		.attr("x2", function(d, j) { return d.x2; })       
		.attr("y2", function(d, j) { return 0; }); 

		lines2.transition().delay(1000).duration(1000)
  		.attr("y1", function(d, j) { return d.y1; })        
		.attr("y2", function(d, j) { return d.y2; });
	}
}		
		
function paintPoints(){
	var i;
	for(i=0;i<numOfSvgs;i++){
		var points1=svgs[i].selectAll("circle.host").data(dataSet[i].player1.points);	
		points1.enter().append("circle")
		.attr("class","host")
		.attr("cx", function(d, j) { return d.cx; })    
		.attr("cy", function(d, j) { if(d.tiebreak == 1) {return yscale2(8);} return yscale(60); })    
		.attr("r",0)
		.style("stroke", function(d){return d.tie2;})
		.style("fill", function(d){return d.tie1;})
	    .on("click",function(d){
	    	//alert(d.hoffset+","+d.moffset+","+d.soffset);
	    	if(d.hoffset!="") {
	    		var tmp = d.hoffset*3600+d.moffset*60+d.soffset*1;
	    		//alert(tmp);
	    		$("#fake").attr("href", "http://www.youtube.com/embed/brupeRLqZfg?autoplay=1&start="+tmp);
				$("#fake").fancybox().click();
	    	}
	    })
		//.style("stroke","blue")
		//.style("fill","blue")
		.append("svg:title")
	    .text(function(d) { return d.comments; });

	    
		points1.transition().delay(2000).duration(1000)
		.attr("cx", function(d, j) { return d.cx; })    
		.attr("cy", function(d, j) { return d.cy; }) 
		.attr("r",3);	

		var points2=svgs[i].selectAll("circle.guest").data(dataSet[i].player2.points);	
		points2.enter().append("circle")
		.attr("class","guest")
		.attr("cx", function(d, j) { return d.cx; })    
		.attr("cy", function(d, j) { if(d.tiebreak == 1) {return yscale2(8);} return yscale(60); })    
		.attr("r",0)
		//.style("stroke", function(d){return d.tie;})
		//.style("stroke","red")
		//.style("fill","red")
		.style("stroke", function(d){return d.tie2;})
		.style("fill", function(d){return d.tie1;})
		/*
		.on("click",function(d){
	    	//alert(d.hoffset+","+d.moffset+","+d.soffset);
	    	if(d.hoffset!="") { 
	    		window.open("https://www.youtube.com/watch?v=brupeRLqZfg&t="+d.hoffset+"h"+d.moffset+"m"+d.soffset+"s","_blank");
	    	}
	    })
	    */
		.on("click",function(d){
			//alert(d.hoffset+","+d.moffset+","+d.soffset);
			if(d.hoffset!="") {
				var tmp = d.hoffset*3600+d.moffset*60+d.soffset*1;
				//alert(tmp);
				$("#fake").attr("href", "http://www.youtube.com/embed/brupeRLqZfg?autoplay=1&start="+tmp);
				$("#fake").fancybox().click();
			}
	    })
		.append("svg:title")
	    .text(function(d) { return d.comments; });
		
		points2.transition().delay(2000).duration(1000)
		.attr("cx", function(d, j) { return d.cx; })    
		.attr("cy", function(d, j) { return d.cy; }) 
		.attr("r",3);
	}
}

function drawAxis(svg,width, height,numOfShots,index,tennisMatch,flag,minSpace,currentWidth,numOfScores){
	
	yscale= d3.scale.ordinal();
	yscale.rangePoints([0,height-height_yaxe-height_axe]);
	//console.log("yaxis="+(height-height_yaxe-height_axe));
	yscale.domain([60, 50, 40, 30, 15, 0]);
	var yAxis = d3.svg.axis()
		.scale(yscale)
		.orient("left");
	yAxis.innerTickSize(7);
	yAxis.outerTickSize(2);
	yAxis.tickFormat(function(d) { 
		if(d==40){
			return "40/deuce";
		}
		if(d==50){
			return "ads";
		}  
		if(d==60){
			return "win";
		}  
		return d;
	});
	//yAxis.ticks(3);
	
	svg.append("g")
	.attr("class", "yaxis")
	.attr("transform", "translate(" + width_axe + "," + height_axe + ")");
	 
	svg.selectAll(".yaxis").transition()
	.call(yAxis)
	
	var numOfGames=tennisMatch.sets[index].host+tennisMatch.sets[index].guest;
	/*
	var dates=[];
	for(i=0;i<numOfGames;i++){
		dates.push(format.parse(tennisMatch.sets[index].games[i].start));
		dates.push(format.parse(tennisMatch.sets[index].games[i].end));
	}
	*/
	xscale = d3.scale.linear();
	if(flag == 1){
		xscale.range([0, (width-width_axe-width_axe2)*minSpace/currentWidth]);
	}
	else{
		xscale.range([0, (width-width_axe-10)*minSpace/currentWidth]);
	}
	xscale.domain([0,numOfShots]);
	var xAxis = d3.svg.axis()
			.scale(xscale)
			.orient("bottom");		
	xAxis.innerTickSize(7);
	xAxis.outerTickSize(2);
	//xAxis.ticks(numOfScores);
	xAxis.ticks(0);
	
	/*
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
	*/
	
	//xAxis.ticks(numOfScores/2);
	svg.append("g")
	.attr("class", "xaxis")
	.attr("transform", "translate(" + width_axe + "," + (height-height_yaxe)+ ")");
	 
	svg.selectAll(".xaxis").transition()
	.call(xAxis)
	//console.log("here");
	
	if(flag == 1){
		yscale2= d3.scale.ordinal();
		yscale2.rangePoints([0,height-height_yaxe-height_axe]);
		//console.log("yaxis="+(height-height_yaxe-height_axe));
		yscale2.domain([8,7,6, 5, 4, 3, 2,1, 0]);
		var yAxis2 = d3.svg.axis()
			.scale(yscale2)
			.orient("right");
		yAxis2.innerTickSize(7);
		yAxis2.outerTickSize(2);
		yAxis2.tickFormat(function(d) { 
			if(d==6){
				return "6/deuce";
			}
			if(d==7){
				return "ads";
			}  
			if(d==8){
				return "win";
			}  
			return d;
		});
		
		var len = (minSpace==currentWidth) ? (width-width_axe2) : ((width-width_axe2)*minSpace/currentWidth+2);
	
		svg.append("g")
		.attr("class", "yaxis2")
		.attr("transform", "translate(" + len + "," + height_axe + ")");
	 
		svg.selectAll(".yaxis2").transition()
		.call(yAxis2);
	}	
}

// Fires whenever a player has finished loading
function onPlayerReady(event) {
    event.target.playVideo();
}

// Fires when the player's state changes.
function onPlayerStateChange(event) {
    // Go to the next video after the current one is finished playing
    if (event.data === 0) {
        $.fancybox.next();
    }
}

// The API will call this function when the page has finished downloading the JavaScript for the player API
function onYouTubePlayerAPIReady() {
    
    // Initialise the fancyBox after the DOM is loaded
    $(document).ready(function() {
        $(".fancybox")
            .attr('rel', 'gallery')
            .fancybox({
                openEffect  : 'none',
                closeEffect : 'none',
                nextEffect  : 'none',
                prevEffect  : 'none',
                padding     : 0,
                margin      : 50,
                beforeShow  : function() {
                    // Find the iframe ID
                    var id = $.fancybox.inner.find('iframe').attr('id');
                    
                    // Create video player object and add event listeners
                    var player = new YT.Player(id, {
                        events: {
                            'onReady': onPlayerReady,
                            'onStateChange': onPlayerStateChange
                        }
                    });
                }
            });
    });
    
}
