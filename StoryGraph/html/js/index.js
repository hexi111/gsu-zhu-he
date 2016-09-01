var map;
var lat1=0.00;
var lat2=100000.00;
var lon1=0.00;
var lon2=100000.00;
var records;
var centerLat;
var centerLon;
var key;
var ifShow=0;
var newDataSet=0;
var ifOldStoryGraph=1;
var markers=[];

$(document).ready(function() { 
	$("input:text").button().css({
          'font' : 'inherit',
         'color' : 'inherit',
    'text-align' : 'left',
       'outline' : 'none',
        'cursor' : 'text'
	});
	$( "#submit" ).button({
		text: true
	})
	.click(function() {
		//alert($("#address").val());
		ifOldStoryGraph=1;
		loadData("address="+$("#address").val());
    	//$("#tabs").slideToggle("slow");
	});
	loadData("address=https://docs.google.com/spreadsheets/d/1mO4yK1vaCnJRHBPflGwjf0zL2QxJNsC6C5d0tULfl00/edit#gid=1576620123");
	//loadData("address=https://docs.google.com/spreadsheets/d/1fyMKzhyv64nUIofZ0EKRPlplbqsLR7LZyQncCMG887Q/edit#gid=902398098");                
	//initialize();
	//loadStoryGraph();
});

function loadData(address){
	$.post('/StoryGraph/dataProviderServlet',address ,function(responseText) {
		//console.log(responseText);
		var returnCode=Number(responseText.returncode);
		if(returnCode==1){
			alert("The address is not correct.");
		}
		else if(returnCode==2){
			alert("The spreadsheet does not contain latitude, longitude or date columns");
		}
		else if(returnCode==3){
			alert("There is no data in that spreadsheet.");
		}
		else if(returnCode==4){
			alert("The spreadsheet is is private or not published.");
		}
		else {
			var str=responseText.content.replace(/\|\|/g,"\n");
			console.log(str);
			//records = $.csv.toObjects(data);
			var dsv = d3.dsv("|", "text/plain");
			records=dsv.parse(str);
			console.log(records);
			centerLat=responseText.centerLat;
			centerLon=responseText.centerLon;
			key=responseText.key;
			newDataSet=1;
			initialize();
		}
	});
}

function chooseStoryGraph(){
	if(ifOldStoryGraph==1){
		loadStoryGraph1();
		ifOldStoryGraph=0;
	}
	else{
		loadStoryGraph();
	}
}

function retrieveBounds(){
	var bnds=map.getBounds();
	var southWest = bnds.getSouthWest();
	var northEast = bnds.getNorthEast();
	lat1=southWest.lat();
	lat2=northEast.lat();
	lon1=southWest.lng();
	lon2=northEast.lng();
	console.log("lat1="+lat1+" lat2="+lat2+" lon1="+lon1+" lon2="+lon2); 
	console.log("bounds_changed");
}

function initialize() {
	
	if(records==null){
		var mapOptions = {
    		zoom: 8,
    		center: new google.maps.LatLng(-34.397, 150.644)
  		};
  		map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
	}
	else {
		var mapOptions = {
			zoom: 8,
			//center: new google.maps.LatLng(-34.397, 150.644)
			center: new google.maps.LatLng(centerLat, centerLon)
		};
		map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
		map.enableKeyDragZoom({
			key: "shift",
			boxStyle: {
				border: "thick dashed black",
				backgroundColor: "white",
				opacity: 0.5
			},
			paneStyle: {
				backgroundColor: "gray",
				opacity: 0.2
			}
		});
		var infowindows=[];
		//var markers=[];
		var myLatLngs=[]; 
		var image1 = 'images/blackdot.png';
		var image2 = 'images/reddot.png';
		var image3 = 'images/bluedot.png';
		var image4 = 'images/yellowdot.png';
		//var image1 = 'images/dot.png';
      	
      	
      	var dz = map.getDragZoomObject();
		google.maps.event.addListener(dz, 'dragend', function(bnds) {
      		retrieveBounds();
			chooseStoryGraph();
      	});
      	
      	google.maps.event.addListener(map, 'bounds_changed', function() {
			if(newDataSet==1){
				retrieveBounds();
				chooseStoryGraph(); 
				newDataSet=0;             
			}
      	});

      	google.maps.event.addListener(map, 'dragend', function() {
			//console.log("dragend");
			retrieveBounds();
			chooseStoryGraph();
		});

      	google.maps.event.addListener(map, 'zoom_changed', function() {
			//console.log("zoom_changed");		
			retrieveBounds();
			chooseStoryGraph();
		});
		records.forEach(function(element,index){	
			if(element["secretcolumn"]>0){
				if(element["secretcolumn"]>=9){
					image=image4;
				}
				else if(element["secretcolumn"]>=6){
					image=image3;
				}
				else if(element["secretcolumn"]>=3){
					image=image2;
				}
				else{
					image=image1;
				}
				var str;
				str="";
				//str='<p> Time: '+element.date+'</p>';
				str=str+'<p> Latitude: '+element.latitude+'</p>';
				str=str+'<p> Longitude: '+element.longitude+'</p>';
				str=str+'<p> # of events '+element.secretcolumn+'</p>';
			
				infowindows[index] = new google.maps.InfoWindow({
					  content: str
				}); 
				myLatLngs[index] = new google.maps.LatLng(element["latitude"], element["longitude"]);
				markers[index]= new google.maps.Marker({
					position: myLatLngs[index],
					map: map,
					icon: image
				});
				//markers[index].id=element["id"];
				markers[index].latitude=element.latitude;
				markers[index].longitude=element.longitude;
				markers[index].date=element.date;
				markers[index].flag=0;
				markers[index].infowindow=infowindows[index];
				element.marker=markers[index];
				google.maps.event.addListener(markers[index], 'click', function() {
					infowindows[index].open(map,markers[index]);
					markers[index].flag=1-markers[index].flag;
					selectPoint(markers[index].latitude,markers[index].longitude,markers[index].flag);
					//localStorage.id=markers[index].id;
					//console.log("id="+localStorage.id);
				});  
				google.maps.event.addListener(markers[index], 'dblclick', function() {
					//localStorage.id=markers[index].id;
					//console.log("id="+localStorage.id);
					//localStorage.latitude=markers[index].latitude;
					//localStorage.longitude=markers[index].longitude;
					//console.log("latitude="+localStorage.latitude);
					//console.log("longitude="+localStorage.longitude);
				});
				google.maps.event.addListener(markers[index], 'mouseover', function() {
					//localStorage.id=markers[index].id;
					//console.log("id="+localStorage.id);
					//alert("over");
				});
				google.maps.event.addListener(markers[index], 'mouseout', function() {
					//alert("out");
					//localStorage.removeItem("id");
				});
				
			}
		});
	}
		
	//alert(map.getBounds());
	/*
	var bnds=map.getBounds();
	var southWest = bnds.getSouthWest();
	var northEast = bnds.getNorthEast();
	lat1=southWest.lat();
	lat2=northEast.lat();
	lon1=southWest.lng();
	lon2=northEast.lng();
	*/
	
	var centerControlDiv = document.createElement('div');
	var centerControl = new CenterControl(centerControlDiv, map);

	centerControlDiv.index = 1;
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(centerControlDiv);
	
	var storyGraphDiv = document.createElement('div');
	var storyGraph = new StoryGraph(storyGraphDiv, map);

	storyGraphDiv.index = 2;
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(storyGraphDiv);
}

function selectPoint(lat,lon,flag){
	d3.select("body").select("svg").selectAll(".dot")
	.attr("r",function(d){
		var r1,r2;
		if(flag==1){
			r1=3;
			r2=2;
		}
		else{
			r1=2;
			r2=2;
		}
		if((d.latitude==lat)&&(d.longitude==lon)){
			return r1;
		}
		else{
			return r2;
		}
	})
	.style("stroke",function(d){
		var s1,s2;
		if(flag==1){
			s1="red";
			s2="blue";
		}
		else{
			s2="blue";
			s1="blue";
		}
		if((d.latitude==lat)&&(d.longitude==lon)){
			return s1;
		}
		else{
			return s2;
		}
	});	
}

function CenterControl(controlDiv, map) {

  // Set CSS for the control border
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#e1e0d3';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to choose other data set';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = 'OPEN';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to
  // Chicago
  google.maps.event.addDomListener(controlUI, 'click', function() {
    //map.setCenter(chicago)
  	//alert("here");
  	$("#inputpanel").slideToggle("slow");
  });

}

function StoryGraph(controlDiv, map) {

  // Set CSS for the control border
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#e1e0d3';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to show StoryGraph';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  /*
  if(ifShow==0){
	  controlText.innerHTML = 'SHOW';
  }
  else{
	  controlText.innerHTML = 'HIDE';
  }
  */
  controlText.innerHTML='SWITCH';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to
  // Chicago
  google.maps.event.addDomListener(controlUI, 'click', function() {
    //map.setCenter(chicago)
  	//alert("here");
  	//$("#storygraph").slideToggle("slow");
  	/*
  	if(ifShow==1){
  		controlText.innerHTML ='SHOW';
  		$("#map-canvas").width("100"+"%");
		$("#content").hide();
		ifShow=0;
		initialize();
  	}
  	else {
  		controlText.innerHTML ='HIDE';
  		$("#map-canvas").width("40"+"%");
  		$("#content").width("40"+"%");
		$("#content").show();
  		ifShow=1;
	  	initialize();	
	  	loadStoryGraph();
  	}
  	*/
  	d3.select("svg").remove();
  	loadStoryGraph();
  });

}

