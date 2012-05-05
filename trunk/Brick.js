
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
	
	// functions
	this.IsRightContact = function(x0, y0) {
		return isntFreeSquare( gX(x0, this.x+1), gY(y0, this.y) );
	}
	
	this.IsLeftContact = function(x0, y0) {
		return isntFreeSquare( gX(x0, this.x-1), gY(y0, this.y) );
	}
	
	this.IsBottomContact = function(x0, y0, brYshift) {
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
	
	// functions
	this.Show = function() {
		this.rightContact = false;
		this.leftContact = false;
		this.bottomContact = false;
		spToDrop = dropY;

		//this.trace_rotation(this.sqArrey[0]);
		//ctx.fillStyle = this.color; //"rgb(0, 250,0)"; // "rgb(250,0,0)";
		for (i = 0; i < this.sqArrey.length; i++) {
			this.trace_rotation(this.sqArrey[i]);
			
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
	this.trace_rotation = function(sqr) {
		BresenhamBy2Pnt(gX(this.X0, this.xR), gY(this.Y0, this.yR), this.xR + sqr.x, this.yR - sqr.y);
	}
	
	this.Move = function() {
		if (!this.bottomContact) {
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
						//if (this.Y0 < 10) // hover on 10 line // for debug
						this.Y0--;
						accumDY = 0;
					}
				}
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
		else {
			if (delayCount < brickDelay) {
				delayCount++;
			}
			else {
				delayCount = 0;
				this.OnSettle();
			}
		}
	}
	
	this.RotateClockwise = function() {
		for (i = 0; i < this.sqArrey.length; i++) {
			//xNew = xR + (yR-yOld)
			this.sqArr_rotated[i].x = this.xR + this.yR - this.sqArrey[i].y;
			
			//yNew = yR + (xOld-xR)
			this.sqArr_rotated[i].y = this.yR + this.sqArrey[i].x - this.xR;
			
			if ( isntFreeSquare(gX(this.X0, this.sqArr_rotated[i].x), gY(this.Y0, this.sqArr_rotated[i].y) ) ) // no way to rotate - ignore changes
				return;
		}
		
		// rotate is permissible - save changes (interchange arrays)
		var bufArr = this.sqArrey;
		this.sqArrey = this.sqArr_rotated
		this.sqArr_rotated = bufArr;
	}
	
	this.AlignYpos = function() {
		//var rest = this.brickY % unit;
		//this.brickY += rest ? unit-rest : 0;
		
		if (this.Yshift > 0) {
			this.Y0--;
		}
		this.Yshift = 0;
	}
	
	this.OnSettle = function() {
		//NextBrick();
		gOnSettle();
	}
}
// --------------- </class Brick> --------------- 
