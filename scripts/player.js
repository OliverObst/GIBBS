/*
 *	Robocup TXT player
 *	Copyright: Edward Moore, Oliver Obst, Mikhail Prokopenko
 *	Date: July 2012
 *	
 *	A javascript program that will read a file on the server that has been processed by rcg2txt (provided with RCSS Server)
 *	& ParseTXT (Custom formatting program).
*/

var DEBUG		= true;
var OFFSET_W            = 26;
var OFFSET_H            = 29;
var FIELD_W		= 748; /* 800; */
var FIELD_H	 	= 472; /* 514; */
var SCALING	 	= 7;
var PLAYER_SIZE	= 7;
var L_COLOUR	= "#FFFF00";
var LG_COLOUR 	= "#8B008B";
var R_COLOUR	= "#FF0000";
var RG_COLOUR	= "#7FFF00";
var B_COLOUR	= "#FFFFFF";
var CBG			= 10;
var cycles 		= 1;
var count 		= 1;
var L_GOALS		= 0;
var R_GOALS		= 0;
var Lteam		= "";
var Rteam		= "";

var prevState = 0;

var context;
var content;
var play;

function toRad(angle)
{
    if (angle<0) angle += 360.0;
    if (angle>360) angle -= 360.0;

    return Math.PI * angle / 180.0;
}

function toGreyRGB(stamina)
{
    if (stamina.slice(0,1) == "#")
    {
	stamina = stamina.slice(1);
    }
    var max = 8000.0;
    var step = max/256.0;
    val = Math.min(parseFloat(stamina), max);
    val = Math.min(Math.floor((max - val)/step), 255);
    grey = val.toString(16);
    grey = grey.length == 1 ? "0" + grey : grey;
    return "#" + grey + grey + grey;
}

function Pause(){ clearInterval(play); play = false; }
function PlayOne(){
	context.clearRect(0,0,FIELD_W+2*OFFSET_W,FIELD_H+2*OFFSET_H);

	for(var i = 0; i < 22+2; i++)
		MakeMove(content[count++]);
}

function RPlayOne(){
	context.clearRect(0,0,FIELD_W+2*OFFSET_W,FIELD_H+2*OFFSET_H);

	for(var i=0; i < 22+2; i++)
		MakeMove(content[--count]);
}

function Play(){
	if(!play)
	play = setInterval( function()
		{
			//Set the cycles & Remove the players
			context.clearRect(0,0,FIELD_W+2*OFFSET_W,FIELD_H+2*OFFSET_H);

			for(var i = 0; i < 22+2; i++)
				MakeMove(content[count++]);
		}, 100);
}

function End()
{
	Pause();
	count = content.length-25*2;
	RPlayOne();
}

function Restart()
{
	Pause();
	count = 1;
	PlayOne();
}

function PrevGoal()
{

    for(var i = count; i > 1; i--)
	if(content[i].split(" ").length > 1)
	    if(content[i].split(" ")[2] == "goal_l" || content[i].split(" ")[2] == "goal_r")
	    {
		count = i-24*(CBG+48);	//Accomodate for the very large wait after a goal
		Pause();
		RPlayOne();
		return;
	    }

    window.status = "No Previous goals found.";
}

function NextGoal()
{
    for(var i = count + 24*CBG; i < content.length; i++)
    {
	if (content[i].split(" ").length > 1)
	{
	    if(content[i].split(" ")[2] == "goal_l" || content[i].split(" ")[2] == "goal_r")
	    {
		count = i-24*CBG;
		Pause();
		PlayOne();
		return;
	    }
	}
    }

    window.status = "No next goals found.";
}


function Start(file)
{
	// Check for the various File API support.
	if ( !(window.File && window.FileReader && window.FileList && window.Blob))
	{
  		alert('The File APIs are not fully supported in this browser.');
  		return false;
  	}

  	var field = document.getElementById("field");
  	context = field.getContext("2d");
  	context.font = "10pt sans-serif";
  	context.textAlign = "left";
	//var fileString = "output2.txt";

	//Run the Game
	content = $.ajax(
	{
		url: file,
		dataType: "html",
		type: "post",
		async: false,
		success: function(data) { console.log("Data Received.") },
		error: function(jqXHR, textStatus, errorThrown) { console.log("ERROR: "+errorThrown); alert("Failed to load '" + file +"'!"); }
	}).responseText.split("\n");

	//Get the team info (assumed to be in first line)
	Lteam = content[0].split(" ")[1];
	Rteam = content[0].split(" ")[2];
	Lteam = Lteam.slice(1,-1);
	Rteam = Rteam.slice(1,-1);

        L_GOALS = 0;
        R_GOALS = 0;

	document.getElementById("Lteam").innerHTML = Lteam + "&nbsp;&nbsp;" + L_GOALS;
	document.getElementById("Rteam").innerHTML = Rteam + "&nbsp;&nbsp;" + R_GOALS;	
}


function MakeMove(fileString)
{
	//Split the string into commands
	var line = fileString.split(" ");

	/*
		line[0] = T | S | b | l | L | r | R
		line[1] = stNum | Bl_x | PL_TM
		line[2] = StNam | Bl_y | PL_NUM
		line[3] =		|	   | PL_X
		line[4] =       |      | PL_Y
		line[5] =              | PL_STAMINA
	*/


	if(line[0] == "S")
	{
		$("#cyclesSlider").slider("value", line[1]);
		document.getElementById("cycles").innerHTML = line[2] + "&nbsp;&nbsp;" + line[1];

		if (L_GOALS == line[3] && R_GOALS == line[4])
		{
		    timeout = false;
		}
		else
		{
		    L_GOALS = line[3];
		    R_GOALS = line[4];
		    document.getElementById("Lteam").innerHTML = Lteam + "&nbsp;&nbsp;" + L_GOALS;
		    document.getElementById("Rteam").innerHTML = Rteam + "&nbsp;&nbsp;" + R_GOALS;
		    timeout = true;
		}
	}
	else if(line[0] == "b")
	{
		context.fillStyle = B_COLOUR;
		context.beginPath();
		context.arc( OFFSET_W+line[1]*SCALING+(FIELD_W/2), OFFSET_H+line[2]*SCALING+(FIELD_H/2) ,PLAYER_SIZE-2,0,Math.PI*2,true );
		context.closePath();
		context.fill();
	}
	else if(line[0] == "l" || line[0] == "r" || line[0] == "L" || line[0] == "R" )
	{

		if( line[0] == "R")
		    context.fillStyle = RG_COLOUR;
		else if(line[0] == "r")
		    context.fillStyle = R_COLOUR;
		else if(line[0] == "L")
		    context.fillStyle = LG_COLOUR;
		else if(line[0] == "l")
		    context.fillStyle = L_COLOUR;

		context.beginPath();
		context.arc( OFFSET_W+line[2]*SCALING+(FIELD_W/2), OFFSET_H+line[3]*SCALING+(FIELD_H/2) ,PLAYER_SIZE,0,Math.PI*2,true );
		context.closePath();
		context.fill();

		var ang0 = parseFloat(line[4]);
		var ang1 = parseFloat(line[5]);
		var x0 = OFFSET_W+line[2]*SCALING+(FIELD_W/2);
		var y0 = OFFSET_H+line[3]*SCALING+(FIELD_H/2);
		var x1 = x0 + PLAYER_SIZE*Math.cos(toRad(ang1));
		var y1 = y0 + PLAYER_SIZE*Math.sin(toRad(ang1));

		context.fillStyle = toGreyRGB(line[6]);
		context.beginPath();
		context.arc( x0, y0, PLAYER_SIZE, toRad(-90.0+ang0), toRad(90.0+ang0), true);		
		context.closePath();
		context.fill();

		context.strokeStyle = "#000000";
		context.beginPath();
		context.moveTo(x0,y0);
		context.lineTo(x1,y1);
		context.stroke();	      

		context.fillStyle = "#FFFFFF";
		context.fillText( line[1], OFFSET_W+line[2]*SCALING+(FIELD_W/2)+5, OFFSET_H+line[3]*SCALING+(FIELD_H/2) );
	}
	else if (line[0] == "T")
	{
	}
	else
	{
		console.log("ERROR: (" + line[0] + ") " + fileString);
		Pause();
	}
}


$(function(){
	var currentValue = $('#cycles');
	$("#cyclesSlider").slider({
		max: 6000,
		    min: 0,
		    slide: function(event, ui) {
		    Pause();
		    count = ui.value*24;
		    PlayOne();

		    // currentValue.html(ui.value +"/"+ 6000);
		}
	    });

    });
