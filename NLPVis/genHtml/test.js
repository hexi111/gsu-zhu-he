var colName=[];
var tmp=[];
var setCollections=[];
var arrayCollections=[];
$(document).ready(function() {                 
    $.ajax({
        type: "GET",
        url: "index.csv",
        success: function(data) {
				var lines=data.split("\n");
				lines.forEach(function(element, index){
					if(index==0){
						colName=element.split(",");
						console.log(colName);
						colName.forEach(function(col,ind){
							setCollections[ind]=new Set();
							arrayCollections[ind]=[];
						});
					}
					else{
						tmp=element.split(",");
						tmp.forEach(function(element1,index1){
							setCollections[index1].add(element1);
						});			
					}
				});
				
				setCollections.forEach(function (element2,index2){
					console.log(index2+" column ");
					arrayCollections[index2]=[];
					element2.forEach(function(element3,index3){
						console.log(element3);
						arrayCollections[index2].push(element3);
					});
				});
				genHtml();
        },
        dataType: "text",
        mimeType: "text/plain"
     });
});

function genHtml(){
	var str="";
	arrayCollections.forEach(function(element,index){
		if(index>0){
			var ind="";
			if(index<10){
				ind="0"+index.toString();
			}
			else{
				ind=index.toString();
			}
			str=str+"<input type=\"checkbox\" id=\"k"+ind+"\" value=\""+colName[index].replace(/ /g,'')+"\" onclick=\"showAndHide(this)\"  unchecked>"+colName[index]+" <br/>";
			str=str+"<div id=\""+colName[index].replace(/ /g,'')+"Display\" style=\"display:none\">";
			element.forEach(function(element1,index1){
				var ind1="";
				if(index1<10){
					ind1="0"+index1.toString();
				}
				else{
					ind1=index1.toString();
				}
				str=str+"<input type=\"checkbox\" id=\"k"+ind+"_"+ind1+"\" onclick=\"updateStatus(this)\" unchecked>"+element1;
			});
			str=str+"</div>";
			str=str+"<br/><br/>";
		}
	});
	$("#content").append(str);
}

function showAndHide(element){
	if(element.checked){
		$("#"+element.value+"Display").show();
	}
	else{
		$("#"+element.value+"Display").hide();
	}
}

function updateStatus(element){
	var gid;
	var tid;
	var eid;
	if(element.checked){
		eid=element.id;
		gid=Number(eid.substring(1, 3)); 
		tid=Number(eid.substring(4,6));
		console.log(arrayCollections[gid][tid]);
	}
	else{
		eid=element.id;
		gid=Number(eid.substring(1, 3)); 
		tid=Number(eid.substring(4,6));
		console.log(arrayCollections[gid][tid]);	
	}
}