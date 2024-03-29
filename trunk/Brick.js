
// x, y speed
var dX;
var dY;
var dropY;

// need of alignment of y position (after drop)
var yAlignNeed = false;

// accumulators of movements (for fitful movement)
var accumDX = 0;
var accumDY = 0;

// for shortly pressed keys
var moveRight = false;
var moveLeft = false;

// available space to drop
var spToDrop = 0;

// one rotate per one move
var rotateDone = false;

var delayCount = 0;

// saved pos
var savedX;
var savedY;

// from brick's float grid  00->x  to global static grid  y
//                          |                             ^
//                         \/                             |
//                          y                            00->x
function gX(x0, x) {
	return x0+x;
}

function gY(y0, y) {
	return y0-y;
}

// --------------- <class Square> --------------- 
function Square() {
	// relative coordinates in brick's float grid
    this.x = 0;
    this.y = 0;	
}

// functions
Square.prototype.IsRightContact = function(x0, y0) {
	return isntFreeSquare( gX(x0, this.x+1), gY(y0, this.y) );
}

Square.prototype.IsLeftContact = function(x0, y0) {
	return isntFreeSquare( gX(x0, this.x-1), gY(y0, this.y) );
}

Square.prototype.IsBottomContact = function(x0, y0, brYshift) {
	var thisXarr = gX(x0, this.x);
	var nextYarr = gY(y0, this.y+1);
	
	if (isntFreeSquare(thisXarr, nextYarr)) {
		return true;
	}
	
	// correct space to drop, if need
	if (isntFreeSquare(thisXarr, nextYarr-1) && // next raw is the last free raw before rim or before busy square
		brYshift + dropY > unit) {				// free space is less than dropY
		
		spToDrop = unit - brYshift;			
	}

	return false;
}
// --------------- </class Square> --------------- 

// --------------- <class Brick> --------------- 
function Brick() {
	// absolute coordinates of (0,0) square (in global static grid)
    this.X0 = 0;
    this.Y0 = 0;
	
	// center of rotation (relative coordinates in brick's float grid)
    this.xR = 0;
    this.yR = 0;
	
	this.Yshift = 0; // Y shift - for smooth drop
	
	this.color;
	
	// signs of contacts to border or filled squares
	var rightContact = false;
	var leftContact = false;
	var bottomContact = false;
	
	// array of squares (with relative coordinates)
    this.sqArrey = new Array();
	this.sqArr_rotated = new Array();
}

// functions
Brick.prototype.Show = function() {
	this.rightContact = false;
	this.leftContact = false;
	this.bottomContact = false;
	spToDrop = dropY;

	//this.trace_rotation(this.sqArrey[4]); // debug
	for (i = 0; i < this.sqArrey.length; i++) {
		//this.trace_rotation(this.sqArrey[i]); // debug
		
		FillCell(gX(this.X0, this.sqArrey[i].x), gY(this.Y0, this.sqArrey[i].y), this.color, this.Yshift);
		
		if (!this.rightContact && this.sqArrey[i].IsRightContact(this.X0, this.Y0)) 
			this.rightContact = true;
			
		if (!this.leftContact && this.sqArrey[i].IsLeftContact(this.X0, this.Y0)) 
			this.leftContact = true;
			
		if (!this.bottomContact && this.sqArrey[i].IsBottomContact(this.X0, this.Y0, this.Yshift)) 
			this.bottomContact = true;
	}
}

// debug
//Brick.prototype.trace_rotation = function(sqr) {
//	BresenhamBy2Pnt(gX(this.X0, this.xR), gY(this.Y0, this.yR), sqr.x - this.xR, this.yR - sqr.y);
//}

Brick.prototype.Move = function() {
	if (!this.bottomContact) {
		// vertical move
		if (downKey) {
			this.Yshift += spToDrop;
			if (this.Yshift >= unit) {
				this.Yshift -= unit;
				this.Y0--;
			}
			yAlignNeed = true;
		}
		else { // downKey released
			if (yAlignNeed) {
				this.AlignYpos();
				yAlignNeed = false;
			}
			else {
				accumDY += dY;
				if (accumDY >= unit) {
					//if (this.Y0 > 12) // hover on 12 line // debug
					this.Y0--;
					accumDY = 0;
				}
			}
		}
	}
	else {
		if (delayCount < brickDelay) {
			delayCount++;
		}
		else {
			delayCount = 0;
			this.OnSettle();
		}
	}
	
	// rotate
	if (upKey) {
		if (!rotateDone) {
			this.RotateClockwise();
			rotateDone = true;
		}
	}
	else {  // upKey released
		rotateDone = false;
	}
	
	// horizontal move
	if (!this.rightContact) {
		if (rightKey) {
			if (accumDX < 0) accumDX = 0;
			accumDX += dX;
			moveRight = true;
			
			if (accumDX >= unit) { // long pressed - accumulate moves
				this.X0++;
				accumDX = 0;
				moveRight = false;
			}
		} // rightKey released
		else if (moveRight) { // shortly pressed - one move
			this.X0++;
			moveRight = false;
		}
	}
	
	if (!this.leftContact) {
		if (leftKey) {
			if (accumDX > 0) accumDX = 0;
			accumDX -= dX;
			moveLeft = true;
			
			if (accumDX <= -unit) { // long pressed - accumulate moves
				this.X0--;
				accumDX = 0;
				moveLeft = false;
			}
		} // leftKey released
		else if (moveLeft) { // shortly pressed - one move
			this.X0--;
			moveLeft = false;
		}
	}
}

Brick.prototype.RotateClockwise = function() {
	for (i = 0; i < this.sqArrey.length; i++) {
		//xNew = xR + (yR-yOld)
		this.sqArr_rotated[i].x = this.xR + this.yR - this.sqArrey[i].y;
		
		//yNew = yR + (xOld-xR)
		this.sqArr_rotated[i].y = this.yR + this.sqArrey[i].x - this.xR;
		
		if ( isntFreeSquare(gX(this.X0, this.sqArr_rotated[i].x), gY(this.Y0, this.sqArr_rotated[i].y) ) ||
			 BresenhamBy2Pnt(gX(this.X0, this.xR), gY(this.Y0, this.yR), this.sqArrey[i].x - this.xR, this.yR - this.sqArrey[i].y) ) // no way to rotate - ignore changes
			return;
	}
	
	// rotate is permissible - save changes (interchange arrays)
	var bufArr = this.sqArrey;
	this.sqArrey = this.sqArr_rotated
	this.sqArr_rotated = bufArr;
}

Brick.prototype.AlignYpos = function() {
	if (this.Yshift > 0) {
		this.Y0--;
	}
	this.Yshift = 0;
}

Brick.prototype.OnSettle = function() {
	this.FillSettled();
	
	if (! gameOver) {
		AddScore(1);
		NextBrick();
	}
}

Brick.prototype.FillSettled = function() {
	var x, y;
	
	for (i = 0; i < this.sqArrey.length; i++) {
		x = gX(this.X0, this.sqArrey[i].x);
		y = gY(this.Y0, this.sqArrey[i].y);
		
		if (typeof(settledArr[y]) == 'undefined')
			settledArr[y] = new Array(dimX);
			
		settledArr[y][x] = this.color;
		markIfFilled(y);
	}
	
	removeMarkedLines();
}

Brick.prototype.NoSpace = function() {
	for (i = 0; i < this.sqArrey.length; i++) {
		if ( isntFreeSquare(gX(this.X0, this.sqArrey[i].x), gY(this.Y0, this.sqArrey[i].y) ) ) return true;
	}
	
	return false;
}

Brick.prototype.SavePos = function() {
    savedX = this.X0;
    savedY = this.Y0;
}

Brick.prototype.RestorePos = function() {
    this.X0 = savedX;
    this.Y0 = savedY;
}
// --------------- </class Brick> --------------- 
