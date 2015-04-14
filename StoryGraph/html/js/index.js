var map;
var lat1;
var lat2;
var lng1;
var lng2;
var oldLat1=0.0;
var oldLat2=0.0;
var oldLng1=0.0;
var oldLng2=0.0;
var records;
var centerLat;
var centerLon;
var key;

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
		loadData("address="+$("#address").val());
    	//$("#tabs").slideToggle("slow");
	});
	loadData("address=https://docs.google.com/spreadsheets/d/1fyMKzhyv64nUIofZ0EKRPlplbqsLR7LZyQncCMG887Q/edit#gid=902398098");                
	//loadData("address=https://docs.google.com/spreadsheets/d/1eYKe2YsOw_MaJerhWE87ueRoQMB-zdZeb06EoAeNlJE/edit#gid=139711139");
	//loadData("address=https://docs.google.com/spreadsheet/ccc?key=0AtNtVAG_C-1KdHJRYWNSallkSkx4cElUSnEtU21UWHc&usp=sheets_web#gid=0");
	/*
	$.ajax({
		type: "GET",
		url: "afg_output.csv",
		success: function(data) {
			records = $.csv.toObjects(data);
			initialize();
		},
		dataType: "text",
		mimeType: "text/plain"
	 });
	*/
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
			//console.log(str);
			//records = $.csv.toObjects(data);
			var dsv = d3.dsv("|", "text/plain");
			records=dsv.parse(str);
			//console.log(records);
			centerLat=responseText.centerLat;
			centerLon=responseText.centerLon;
			key=responseText.key;
			initialize();
		}
	});
}

function initialize() {
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
			backgroundColor: "red",
			opacity: 0.5
		},
		paneStyle: {
			backgroundColor: "gray",
			opacity: 0.2
		}
	});
	
	var dz = map.getDragZoomObject();
	google.maps.event.addListener(dz, 'dragend', function(bnds) {
		//console.log('DragZoom DragEnd :' + bnds);
		var southWest = bnds.getSouthWest();
		var northEast = bnds.getNorthEast();
		lat1=southWest.lat();
		lat2=northEast.lat();
		lng1=southWest.lng();
		lng2=northEast.lng();
	
		//console.log(lat1+","+lat2+","+lng1+","+lng2);
		/*
		records.forEach(function(element,index){
			if((element["latitude"]>=lat1)&&(element["latitude"]<=lat2)&&(element["longitude"]>=lng1)&&(element["longitude"]<=lng2)){
				var str;
				str='<p> Time: '+element.date+'</p>';
				str=str+'<p> Latitude: '+element.latitude+'</p>';
				str=str+'<p> Longitude: '+element.longitude+'</p>';
				console.log(str);
			}
		});
		*/
			
		//window.open("storygraph.html?key="+key+"&lat1="+lat1+"&lat2="+lat2+"&lon1="+lng1+"&lon2="+lng2, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=0, left=0, width="+window.innerWidth+", height="+window.innerHeight);      	
		console.log("oldLat1="+oldLat1+"oldLat2="+oldLat2+"oldLng1="+oldLng1+"oldLng2="+oldLng2);
		console.log("lat1="+lat1+"lat2="+lat2+"lng1="+lng1+"lng2="+lng2);
		if((lat1>=oldLat1)&&(oldLat2>=lat2)&&(oldLng1<=lng1)&&(oldLng2>=lng2)){
			localStorage.lat1=lat1;
			localStorage.lat2=lat2;	
			localStorage.lng1=lng1;
			localStorage.lng2=lng2;	
		}
		else{
			var link2="storygraph1.html?key="+key+"$lat1="+lat1+"$lat2="+lat2+"$lon1="+lng1+"$lon2="+lng2;
			var link1="storygraph.html?key="+key+"&lat1="+lat1+"&lat2="+lat2+"&lon1="+lng1+"&lon2="+lng2+"&link="+link2;
			window.open(link1," _blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=0, left=0, width="+window.innerWidth+", height="+window.innerHeight);      	
    		oldLat1=lat1;
    		oldLat2=lat2;
    		oldLng1=lng1;
    		oldLng2=lng2;
    	}
    });
    
	var infowindows=[];
	var markers=[];
	var myLatLngs=[]; 
	var image1 = 'images/blackdot.png';
	var image2 = 'images/reddot.png';
	var image3 = 'images/bluedot.png';
	var image4 = 'images/yellowdot.png';
	//var image1 = 'images/dot.png';

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
			google.maps.event.addListener(markers[index], 'click', function() {
				infowindows[index].open(map,markers[index]);
				//localStorage.id=markers[index].id;
				//console.log("id="+localStorage.id);
			});  
			google.maps.event.addListener(markers[index], 'dblclick', function() {
				//localStorage.id=markers[index].id;
				//console.log("id="+localStorage.id);
				localStorage.latitude=markers[index].latitude;
				localStorage.longitude=markers[index].longitude;
				console.log("latitude="+localStorage.latitude);
				console.log("longitude="+localStorage.longitude);
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

	/*
	var bounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(32.68331909, 69.41610718),
		new google.maps.LatLng(33.68331909, 70.41610718)
	);
	*/
	// Define a rectangle and set its editable property to true.
	/*
	var rectangle = new google.maps.Rectangle({
		bounds: bounds,
		editable: true,
		draggable: true
	});
	rectangle.setMap(map);
	*/
	
	var centerControlDiv = document.createElement('div');
	var centerControl = new CenterControl(centerControlDiv, map);

	centerControlDiv.index = 1;
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(centerControlDiv);

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
  controlText.innerHTML = 'OPEN DATASET';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to
  // Chicago
  google.maps.event.addDomListener(controlUI, 'click', function() {
    //map.setCenter(chicago)
  	//alert("here");
  	$("#inputpanel").slideToggle("slow");
  });

}

