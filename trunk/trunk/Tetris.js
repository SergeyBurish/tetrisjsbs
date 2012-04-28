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

if (document.addEventListener) { // FF � ������
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
	
	brick.color = "rgb(0, 0, 250)"; // "rgb(250,0,0)";
	

	// 5 length line
	brick.xR = 0;
    brick.yR = 2;

	brick.sqArr_rotated.push(new Square());
	brick.sqArrey.push(new Square());
	brick.sqArrey[0].x = 0;
	brick.sqArrey[0].y = 0;
	
	brick.sqArr_rotated.push(new Square());
	brick.sqArrey.push(new Square());
	brick.sqArrey[1].x = 0;
	brick.sqArrey[1].y = 1;	

	brick.sqArr_rotated.push(new Square());
	brick.sqArrey.push(new Square());
	brick.sqArrey[2].x = 0;
	brick.sqArrey[2].y = 2;	
	
	brick.sqArr_rotated.push(new Square());
	brick.sqArrey.push(new Square());
	brick.sqArrey[3].x = 0;
	brick.sqArrey[3].y = 3;

	brick.sqArr_rotated.push(new Square());
	brick.sqArrey.push(new Square());
	brick.sqArrey[4].x = 0;
	brick.sqArrey[4].y = 4;
	

	/* 
	// inverted comma
	brick.xR = 0.5;
    brick.yR = 0.5;

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
	*/
	
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
	
	BresenhamCircle(3, 19, 1, 0);
	circleBy2PntBres(5, 6, -4, 6);

}

function circleBy2PntBres(x_c, y_c, x, y) {
	ctx.fillStyle = "rgb(250, 250, 0)";
	// center
	setPixel(x_c, y_c, 0);
	
	// sectors of the circle:
	//   8 | 1
	// 7 \ | / 2
	// ---------
	// 6 / | \ 3
	//   5 | 4
	
	var sector = 0;
	if      (x >= 0 &&  x <= y) DoCircleBy2PntBres(x_c, y_c,  x, y, 1); // sector = 1
	else if (x < 0  && -x <= y) DoCircleBy2PntBres(x_c, y_c, -x, y, 8); // sector = 8
	
	DoCircleBy2PntBres(x_c, y_c, x, y, sector);
}

function DoCircleBy2PntBres(x_c, y_c, x, y, sector) {
	var x0 = x, y0 = y;
	//sector = 8;
	
	selectCell(x_c, y_c, x0, y0, sector);
	selectCell(x_c, y_c, y0, x0, sector);
	selectCell(x_c, y_c, y0, -x0, sector);
	
	var delta;
	if (x == y) delta = -1;
	else 
		delta = 4*x-2*y+3;
		
	var d0 = delta;
	//delta=3-2*radius;
	while(x<y) {
		if (delta<0)
			delta+=4*x+6;
		else {
			delta+=4*(x-y)+10;
			y--;
		}
		x++;
		
		selectCell(x_c, y_c, x, y, sector);
		selectCell(x_c, y_c, y, x, sector);
	}
 
	if(x==y) selectCell(x_c, y_c, x, y, sector);
	
	
	x = x0;
	y = y0;
	delta = d0;
	while (x > 0) {
		// current point (x0, y0) is set already, so set next point after calculation
		if (delta<0) {
			delta+= 4*(y-x)+6;
			y++;
		}
		else
			delta+= 6-4*x;
			
		x--;
		
		selectCell(x_c, y_c, y, x, sector);
		selectCell(x_c, y_c, y, - x, sector);
	}
}

function selectCell(x_c, y_c, xRel, yRel, sector) { // Rel-ative
	var xAbs, yAbs; // Abs-olute
	
	switch (sector)
	{
		case 1:
			xAbs = x_c + xRel; yAbs = y_c + yRel;
			break;
			
		case 8:
			xAbs = x_c + yRel; yAbs = y_c + xRel;
			break;
			
		//default:
	}
	
	ctx.fillRect (unit*(xAbs), unit*(dimY - yAbs - 1),
										unit, unit);
}

function BresenhamCircle(x_center, y_center, radius, color_code) {
	ctx.fillStyle = "rgb(0, 250, 250)";
	// center
	setPixel(x_center, y_center, color_code);
	
    var x,y,delta;
    x = 0;
    y = radius;
    delta=3-2*radius;
    while(x<y) {
        plot_circle(x,y,x_center,y_center,color_code);
        plot_circle(y,x,x_center,y_center,color_code);
        if (delta<0)
            delta+=4*x+6;
        else {
            delta+=4*(x-y)+10;
            y--;
        }
        x++;
    }
 
    if(x==y) plot_circle(x,y,x_center,y_center,color_code);
}

function plot_circle(x, y, x_center, y_center, color_code)
{
    setPixel(x_center+x,y_center+y, color_code);
    setPixel(x_center+x,y_center-y, color_code);
    setPixel(x_center-x,y_center+y, color_code);
    setPixel(x_center-x,y_center-y, color_code);
}

function setPixel(aX, aY, sector) {
	var x = aX, y = aY;
	
	switch (sector)
	{
		case 0:
			x = aX; y = aY;
			break;
			
		case 1:
			x = -aX; y = aY;
			break;
			
		default:
	}
	
	ctx.fillRect (unit*(x), unit*(dimY - y - 1),
										unit, unit);
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
	// ������ � ������� 2 ���� �������
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
