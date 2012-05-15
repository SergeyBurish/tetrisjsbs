var canvas;
var ctx;
var cWidth;
var gridWidth;
var gridHeight; // == cHeight;
var unit;

var dimX;
var dimY;

var redrawInterval; // ms
var brickDelay; // before next brick - in redrawIntervals

var mode; // 0 - standart bricks, otherwise - random bricks

// pressed keys
var rightKey = false;
var leftKey = false;
var upKey = false;
var downKey = false;

// Arrays of Settled Squares
var settledArr;

// Array of lines marked to remove
var markedLinesArr;

var brick;
var nextBrick;

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

if (document.addEventListener) {
        document.addEventListener('keydown', onKeyDown, false);
		document.addEventListener('keyup', onKeyUp, false);
    }


function init() {
	canvas = document.getElementById("canvas01");
	if (canvas.getContext) {
		ctx = canvas.getContext("2d");
		cWidth = canvas.clientWidth;
		gridHeight = canvas.clientHeight;
		
		gridWidth = cWidth - Math.floor(cWidth/3);
		
		dimX = 14;
		unit = Math.floor(gridWidth/dimX);
		dimY = Math.floor(gridHeight/unit);
		
		settledArr = new Array(dimY);
		
		redrawInterval = 10;
		brickDelay = 100;
		
		dX = 4;
		dY = 0.25;
		dropY = 8;
		
		mode = 1;

		markedLinesArr = new Array();
		
		// get the first brick
		nextBrick = createBrick();
		nextBrick.SavePos();
		
		NextBrick();
		
		return setInterval(Draw, redrawInterval);
	}
}

function NextBrick() {
	brick = nextBrick;
	brick.RestorePos();
	
	nextBrick = createBrick();
	nextBrick.SavePos();
	nextBrick.X0 = dimX+1;
    nextBrick.Y0 = dimY-2;

	if ( brick.NoSpace() ) {
		brick.Show();
		alert ("game over");
		RestartGame();
	}
}

function createBrick() {
	if (mode == 0)
		return createStandartBrick(getRandomInt(0, 6));
	
	return createRandomBrick();
}

function Draw() {
	// clear
	ctx.clearRect(1, 1, cWidth-2, gridHeight-2);
	
	// show border
	ctx.strokeRect (0, 0, gridWidth-1, gridHeight-1);
	
	Grid();
	ShowSettled();
	nextBrick.Show();
	brick.Show();
	brick.Move();
}

function Grid() {
	// show border
	ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
	
	ctx.beginPath();

	// verticals
	var offsetX = unit;
	for (var i = 1; offsetX < gridWidth; i++) {
		offsetX = unit * i;
		ctx.beginPath();
		
		ctx.moveTo(offsetX, 0);
		ctx.lineTo(offsetX, gridHeight);
		
		ctx.closePath();
		ctx.stroke();
	}
	
	// horizontals
	var offsetY = unit;
	for (i = 1; offsetY < gridHeight; i++) {
		offsetY = unit * i;
		ctx.beginPath();
		
		ctx.moveTo(0, offsetY);
		ctx.lineTo(gridWidth, offsetY);
		
		ctx.closePath();
		ctx.stroke();
	}
}

function BresenhamBy2Pnt(x_c, y_c, x, y) {
	// center
	//FillCell(x_c, y_c, "rgb(250, 150, 0)", 0);
	
	// sectors of the circle:
	//       8  1  1
	//    8     |     1
	//  7   \   |   /   2
	//        \ | /
	// 7 --------------- 2
	//        / | \    
	//  6   /   |   \   3
	//    5     |     4
	//       5  4  4
	
	var sector = 0;
	if (x >= 0 && x <=  y) return DoBresenhamBy2Pnt(x_c, y_c,  x,  y, 1);
	if (y >= 0 && x >   y) return DoBresenhamBy2Pnt(x_c, y_c,  y,  x, 2);
	if (y <  0 && x >  -y) return DoBresenhamBy2Pnt(x_c, y_c, -y,  x, 3);
	if (x >= 0 && x <= -y) return DoBresenhamBy2Pnt(x_c, y_c,  x, -y, 4);
	if (x <  0 && x >=  y) return DoBresenhamBy2Pnt(x_c, y_c, -x, -y, 5);
	if (y <  0 && x <   y) return DoBresenhamBy2Pnt(x_c, y_c, -y, -x, 6);
	if (y >= 0 && x <  -y) return DoBresenhamBy2Pnt(x_c, y_c,  y, -x, 7);
	if (x <  0 && x >= -y) return DoBresenhamBy2Pnt(x_c, y_c, -x,  y, 8);
	
	return false; // should never happen; error handling?
}

function DoBresenhamBy2Pnt(x_c, y_c, x, y, sector) {
	if (x == 0 && y == 0)
		return false;
		
	var x0 = x, y0 = y;
	
	if ( selectCell(x_c, y_c, x0, y0, sector) ) return true;
	if ( selectCell(x_c, y_c, y0, x0, sector) ) return true;
	if ( selectCell(x_c, y_c, y0, -x0, sector) ) return true;
	
	var delta;
	if (x == 1 && y == 1)				delta = 1;			// freaks of 
	else if ((x==0 && y==1) || (x==y))	delta = -1;			//  special cases;
	else								delta = 4*x-2*y+3;	// conmmon case
		
	var d0 = delta;
	
	// forward pass
	while(x<y) {
		if (delta<0)
			delta+=4*x+6;
		else {
			delta+=4*(x-y)+10;
			y--;
		}
		x++;
		
		if ( selectCell(x_c, y_c, x, y, sector) ) return true;
		if ( selectCell(x_c, y_c, y, x, sector) ) return true;
	}
 
	if ( (x==y) && selectCell(x_c, y_c, x, y, sector) ) return true;
	
	
	x = x0;
	y = y0;
	delta = d0;
	
	// backward pass
	while (x > 0.5) {
		if (delta<0) {
			delta+= 4*(y-x)+6;
			y++;
		}
		else
			delta+= 6-4*x;
			
		x--;
		
		if ( selectCell(x_c, y_c, y, x, sector) ) return true;
		if ( selectCell(x_c, y_c, y, -x, sector) ) return true;
	}
	
	return false;
}

function selectCell(x_c, y_c, xRel, yRel, sector) { // Rel-ative
	var xAbs, yAbs; // Abs-olute
	
	switch (sector)
	{
		case 1: xAbs = x_c + xRel; yAbs = y_c + yRel; break;
		case 2: xAbs = x_c + xRel; yAbs = y_c - yRel; break;
		case 3: xAbs = x_c + yRel; yAbs = y_c - xRel; break;
		case 4: xAbs = x_c - yRel; yAbs = y_c - xRel; break;
		case 5: xAbs = x_c - xRel; yAbs = y_c - yRel; break;
		case 6: xAbs = x_c - xRel; yAbs = y_c + yRel; break;
		case 7: xAbs = x_c - yRel; yAbs = y_c + xRel; break;
		case 8: xAbs = x_c + yRel; yAbs = y_c + xRel; break;

		default: return false; // should never happen; error handling?
	}
	
	//FillCell(xAbs, yAbs, "rgb(250, 250, 150)", 0); return false; // debug
	return isntFreeSquare(xAbs, yAbs);
}

function ShowSettled() {
	for (var y = 0; y < dimY; y++) {
		if (typeof(settledArr[y]) != 'undefined') {
			for (var x = 0; x < dimX; x++) {
				if (typeof(settledArr[y][x]) != 'undefined') {
					FillCell(x, y, settledArr[y][x], 0);
				}
			}
		}
	}
}

function FillCell(x, y, color, dy) {
	ctx.fillStyle = color;
	ctx.fillRect (unit*(x), unit*(dimY - y - 1) + dy, unit, unit);
}

function isntFreeSquare(x, y) {
	if (x < 0 || x >= dimX) return true;
	if (y < 0 || y >= dimY) return true;
	
	if ( (typeof(settledArr[y]) != 'undefined') && 
		 (typeof(settledArr[y][x]) != 'undefined') ) return true;
		 
	return false;
}

function FreeSquare(x, y) {
	return !isntFreeSquare(x, y);
}

function markIfFilled(y) {
	var x;
	
	for (x = 0; x < dimX; x++) {
		if ( FreeSquare(x, y) ) return;
	}
	
	markedLinesArr.push(y);
}

function removeMarkedLines() {
	markedLinesArr.sort();
	markedLinesArr.reverse();
	
	for (i = 0; i < markedLinesArr.length; i++) {
		settledArr.splice(markedLinesArr[i], 1);
	}
	
	// clear markedLinesArr
	markedLinesArr.length = 0;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function RestartGame() {
	settledArr.length = 0;
	NextBrick();
}