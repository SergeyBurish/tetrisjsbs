var container;
var canvas;
var ctx;

var cWidth;
var gridWidth;
var gridHeight; // == cHeight for now;

var panelWidth;
var topPanelHeight;

var unit;

var dimX;
var dimY;

var redrawInterval; // ms
var brickDelay; // before next brick - in redrawIntervals

var message; // text element shown over the canvas;
var scoreMsg; // text element shown score;
var score = 0;
var gameOver; // game over sign

var mode; // 0 - standart bricks, otherwise - random bricks
var standRB; // standart radio button

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
	container = document.getElementById("container");
	canvas = document.getElementById("canvas01");
	message = document.createElement("div");
	scoreMsg = document.createElement("div");
	
	if (canvas.getContext) {
		ctx = canvas.getContext("2d");
		cWidth = canvas.clientWidth;
		gridHeight = canvas.clientHeight;
		
		panelWidth = Math.floor(cWidth/3);
		topPanelHeight = Math.round(gridHeight/2);
		
		gridWidth = cWidth - panelWidth;
		
		dimX = 14;
		unit = Math.floor(gridWidth/dimX);
		dimY = Math.floor(gridHeight/unit);
		
		settledArr = new Array(dimY);
		
		redrawInterval = 10;
		brickDelay = 100;
		
		dX = 4;
		dY = 0.25;
		dropY = 8;
		
		mode = 0;
		gameOver = false;

		markedLinesArr = new Array();
		
		// controls
		var yPos = topPanelHeight + unit;
		var but = addButton("Restart", gridWidth+unit, yPos, RestartGame);
		yPos += but.offsetHeight + 10;
		standRB = addRadioButton("mode", "Standart", true, gridWidth+unit, yPos, SwitchMode);
		yPos += standRB.offsetHeight + 10;
		addRadioButton("mode", "Random", false, gridWidth+unit, yPos,  SwitchMode);
		
		// get the first brick
		nextBrick = createBrick();
		nextBrick.SavePos();
		
		NextBrick();
		
		setInterval(Draw, redrawInterval);
	}
}

function addButton(name, x, y, onclick) {
	var button = document.createElement("button");
	
	var buttext = document.createTextNode(name);
	button.appendChild(buttext);
	button.onclick = onclick;
	
	button.style.position = "absolute";
	button.style.left = x + "px";
	button.style.top =  y + "px";
	
	container.appendChild(button);
	
	return button;
}

function addRadioButton(name, value, checked, x, y, onclick) {
	var radioHtml = '<input type="radio" name="' + name + '" value="' + value + '"';
	if ( checked ) {
		radioHtml += ' checked="checked"';
	}
	radioHtml += '/>';
	
	var radioBut = document.createElement('div');
	radioBut.innerHTML = radioHtml;
	
	var rtext = document.createTextNode(value);
	radioBut.appendChild(rtext);
	radioBut.onclick = onclick;
	
	radioBut.style.position = "absolute";
	radioBut.style.left = x + "px";
	radioBut.style.top =  y + "px";
	
	container.appendChild(radioBut);
	
	return radioBut;
}

function SwitchMode() {
	mode = standRB.firstChild.checked? 0 : 1;
}

function NextBrick() {
	brick = nextBrick;
	brick.RestorePos();
	
	nextBrick = createBrick();
	nextBrick.SavePos();
	nextBrick.X0 = dimX+1;
    nextBrick.Y0 = dimY-2;

	if ( brick.NoSpace() ) {
		gameOver = true;
		brick.Show();
		ShortMessage("Game over", "rgb(255, 0, 0)", "50px sans-serif");
	}
}

function createBrick() {
	if (mode == 0)
		return createStandartBrick(getRandomInt(0, 6));
	
	return createRandomBrick();
}

function Draw() {
	// clear
	ctx.clearRect(1, 1, gridWidth-2, gridHeight-2);
	ctx.clearRect( gridWidth+2, 1, panelWidth - 2, topPanelHeight );
	
	// show border
	ctx.strokeRect (0, 0, gridWidth-1, gridHeight-1);
	
	Grid();
	ShowSettled();
	nextBrick.Show();
	brick.Show();
	brick.Move();
}

function Grid() {
	ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
	
	ctx.beginPath();

	// verticals
	var offsetX = 0;
	while (offsetX < gridWidth) {
		offsetX += unit;
		ctx.beginPath();
		
		ctx.moveTo(offsetX, 0);
		ctx.lineTo(offsetX, gridHeight);
		
		ctx.closePath();
		ctx.stroke();
	}
	
	// horizontals
	var offsetY = 0;
	while (offsetY < gridHeight) {
		offsetY += unit;
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
		AddScore(10);
	}
	
	// clear markedLinesArr
	markedLinesArr.length = 0;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function RestartGame() {
	gameOver = false; // drop gameOver sign
	settledArr.length = 0; // clear all settled cells;
	score = 0; // clear score
	AddScore(0); // show score
	
	try {
	container.removeChild(message); // clear all messages
	}
	catch(err) {} // ignore
	
	NextBrick();
}

function AddScore(inc) {
	score += inc;
	scoreMsg.innerHTML = score;
	
	scoreMsg.style.font = "30px sans-serif";
	scoreMsg.style.color = "rgb(0, 0, 255)";
		
	scoreMsg.style.position = "absolute";
	
	container.appendChild(scoreMsg);
		
	scoreMsg.style.top = gridHeight - scoreMsg.offsetHeight - 5 + "px";
	scoreMsg.style.left = gridWidth+unit + "px";
}

function ShortMessage(text, color, font) {
	message.innerHTML = text;
	
	message.style.font = font;
	message.style.color = color;
		
	message.style.position = "absolute";
	message.style.visibility = "hidden";
	
	container.appendChild(message);
	
	if (message.offsetWidth >= gridWidth) {
		container.removeChild(message);
		return;
	}
	
	message.style.top = gridHeight/2 + "px";
	message.style.left = (gridWidth - message.offsetWidth)/2 + "px";
	
	message.style.background =  "rgba(0, 100, 255, 0.4)";
	//message.style.outlineStyle = "solid";
	//message.style.outlineWidth = "thin";
	//message.style.outlineColor = "rgba(0, 0, 0, 0.15)";
	
	message.style.visibility = "visible";
}