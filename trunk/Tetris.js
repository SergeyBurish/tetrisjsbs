var canvas;
var ctx;
var cWidth;
var cHeight;
var unit;

var dimX;
var dimY;

var redrawInterval; // ms
var brickDelay; // before next brick - in redrawIntervals

// pressed keys
var rightKey = false;
var leftKey = false;
var upKey = false;
var downKey = false;

// Arrays of Settled Squares
var settledArr;

var brick;
var zzz = 0;

// key is down
function onKeyDown(event) {
	if (event.keyCode == 37) leftKey = true;
	else if (event.keyCode == 38) upKey = true;
	else if (event.keyCode == 39) rightKey = true;
	else if (event.keyCode == 40) downKey = true;
}

// key is released
function onKeyUp(event) {
	if (event.keyCode == 37) leftKey = false;
	else if (event.keyCode == 38) upKey = false;
	else if (event.keyCode == 39) rightKey = false;
	else if (event.keyCode == 40) downKey = false;
}

if (document.addEventListener) { // FF и другие
        document.addEventListener('keydown', onKeyDown, false);
		document.addEventListener('keyup', onKeyUp, false);
    }


function init() {
	canvas = document.getElementById("canvas01");
	if (canvas.getContext) {
		ctx = canvas.getContext("2d");
		cWidth = canvas.clientWidth;
		cHeight = canvas.clientHeight;
		dimX = 14;
		unit = cWidth/14;
		dimY = cHeight/unit;
		zzz = dimY - 3;
		
		settledArr = new Array(dimY);
		
		redrawInterval = 10;
		brickDelay = 100;
		
		dX = 4;
		dY = 0.25;
		dropY = 8;
		
		//InitSquareArrrays();
		settledArr[0] = new Array(dimX);
		settledArr[0][0] = "rgb(250, 0, 0)";
		settledArr[0][3] = "rgb(250, 0, 0)";
		
		settledArr[2] = new Array(dimX);
		settledArr[2][0] = "rgb(250, 0, 0)";
		settledArr[2][3] = "rgb(250, 0, 0)";
		
		settledArr[5] = new Array(dimX);
		settledArr[5][1] = "rgb(0, 250, 0)";
		
		settledArr[6] = new Array(dimX);
		settledArr[6][4] = "rgb(0, 0, 250)";
		settledArr[6][7] = "rgb(0, 0, 250)";
		
		settledArr[8] = new Array(dimX);
		settledArr[8][4] = "rgb(0, 0, 250)";
		settledArr[8][5] = "rgb(0, 0, 250)";

		
		//alert(settledArr[2][0] + " " + settledArr[2][3] + " " + settledArr[5][1]); // + " " + sq.z + " " + sq.a);
		
		//ShowSettled();
		NextBrick(); // get first brick
		//alert(brick.sqArrey.length + " " + brick.sqArrey[0].x + " " + brick.sqArrey[1].y); // + " " + sq.z + " " + sq.a);
		
		return setInterval(Draw, redrawInterval);
		//draw();
	}
}

function NextBrick() {
	brick = new Brick();
	
	brick.X0 = 5;
	brick.Y0 = 0;
	
    brick.xR = 0.5;
    brick.yR = 0.5;
	
	brick.color = "rgb(0, 0, 250)"; // "rgb(250,0,0)";

	brick.sqArr_rotated.push(new Square());
	brick.sqArrey.push(new Square());
	brick.sqArrey[0].x = 0;
	brick.sqArrey[0].y = 0;
	
	brick.sqArr_rotated.push(new Square());
	brick.sqArrey.push(new Square());
	brick.sqArrey[1].x = 1;
	brick.sqArrey[1].y = 0;	

	brick.sqArr_rotated.push(new Square());
	brick.sqArrey.push(new Square());
	brick.sqArrey[2].x = 0;
	brick.sqArrey[2].y = 1;	
	
	brick.sqArr_rotated.push(new Square());
	brick.sqArrey.push(new Square());
	brick.sqArrey[3].x = 1;
	brick.sqArrey[3].y = 1;

	brick.sqArr_rotated.push(new Square());
	brick.sqArrey.push(new Square());
	brick.sqArrey[4].x = 2;
	brick.sqArrey[4].y = 1;
/*	
	brick.sqArrey.push(new Square());
	brick.sqArrey[0].x = 1;
	brick.sqArrey[0].y = 0;
	
	brick.sqArrey.push(new Square());
	brick.sqArrey[1].x = 0;
	brick.sqArrey[1].y = 1;	

	brick.sqArrey.push(new Square());
	brick.sqArrey[2].x = 1;
	brick.sqArrey[2].y = 1;	
	
	brick.sqArrey.push(new Square());
	brick.sqArrey[3].x = 2;
	brick.sqArrey[3].y = 1;
*/	
}

function Draw() {
	// clear
	ctx.clearRect(1, 1, cWidth-2, cHeight-2);
	
	// show border
	//ctx.strokeStyle = "rgb(255,0,0)";
	//ctx.setLineWidth(5);
	ctx.strokeRect (0, 0, cWidth-1, cHeight-1);
	
	Grid();
	ShowSettled();
	brick.Show();
	brick.Move();
}

function Grid() {
	// show border
	ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
	
	ctx.beginPath();

	// verticals
	var offsetX = unit;
	for (var i = 1; offsetX < cWidth; i++) {
		offsetX = unit * i;
		ctx.beginPath();
		
		ctx.moveTo(offsetX, 0);
		ctx.lineTo(offsetX, cHeight);
		
		ctx.closePath();
		ctx.stroke();
	}
	
	// horizontals
	var offsetY = unit;
	for (i = 1; offsetY < cHeight; i++) {
		offsetY = unit * i;
		ctx.beginPath();
		
		ctx.moveTo(0, offsetY);
		ctx.lineTo(cWidth, offsetY);
		
		ctx.closePath();
		ctx.stroke();
	}
}

function ShowSettled() {
	//var raws = 
	for (var y = 0; y < dimY; y++) {
		if (typeof(settledArr[y]) != 'undefined') {
			for (var x = 0; x < dimX; x++) {
				if (typeof(settledArr[y][x]) != 'undefined') {
					ctx.fillStyle = settledArr[y][x];
					ctx.fillRect (unit*(x), unit*(dimY - y - 1),
														unit, unit);
					//alert(y + ";" + x);
				}
			}
		}
	}
}

function isntFreeSquare(x, y) {
	if (x < 0 || x >= dimX) return true;
	if (y < 0 || y >= dimY) return true;
	
	if ( (typeof(settledArr[y]) != 'undefined') && 
		 (typeof(settledArr[y][x]) != 'undefined') ) return true;
		 
	return false;
}

function gOnSettle() {

	/*
	arr = [ "a", "b", "c", "d", "e" ]
	// удалим с индекса 2 один элемент
	arr.splice(2,1) 
	// arr = ["a", "b", "d", "e"]
	*/
	
	settledArr.splice(1,1);

	if (zzz < dimY) {
		settledArr[zzz] = new Array(dimX);
		settledArr[zzz][1] = "rgb(250, 0, 250)";
		settledArr[zzz][10] = "rgb(250, 0, 250)";
		zzz++;
	}


	NextBrick();
}
