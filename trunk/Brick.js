
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

// 
var spToDrop = 0;

// one rotate per one move
var rotateDone = false;

var delayCount = 0;

// --------------- <class Square> --------------- 
function Square() {
    this.x = 0;
    this.y = 0;
	
	// functions
	this.IsRightContact = function(x0, y0) {
		var rightXarr = this.x + x0 + 1;
		var thisYarr = dimY - 1 - this.y - y0;
		
		if (rightXarr == dimX) {
			return true;
		}
		
		if (typeof(settledArr[thisYarr]) != 'undefined' && 
		    typeof(settledArr[thisYarr][rightXarr]) != 'undefined') {
			return true;
		}
		
		return false;
	}
	
	this.IsLeftContact = function(x0, y0) {
		var leftXarr = this.x + x0 - 1;
		var thisYarr = dimY - 1 - this.y - y0;
		
		if (leftXarr < 0) {
			return true;
		}
		
		if (typeof(settledArr[thisYarr]) != 'undefined' && 
		    typeof(settledArr[thisYarr][leftXarr]) != 'undefined') {
			return true;
		}
		
		return false;
	}
	
	this.IsBottomContact = function(x0, y0, brYshift) {
		var nextYarr = dimY - 2 - this.y - y0;
		
		if (nextYarr < 0) {
			return true;
		}
		
		if (typeof(settledArr[nextYarr]) != 'undefined' && 
		    typeof(settledArr[nextYarr][this.x + x0]) != 'undefined') {
			return true;
		}
		
		if (spToDrop == dropY) {
			if (nextYarr == 0 || // next raw is the last free raw before rim or
				(typeof(settledArr[nextYarr-1]) != 'undefined' && // before busy square 
				 typeof(settledArr[nextYarr-1][this.x + x0]) != 'undefined')) {
				if (brYshift + dropY > unit) {
					spToDrop = unit - brYshift;
				}
			}
		}

		return false;
	}
}
// --------------- </class Square> --------------- 

// --------------- <class Brick> --------------- 
function Brick() {
	// absolute coordinates of (0,0) square
    this.X0 = 0;
    this.Y0 = 0;
	
	// center of rotation (relative coordinates)
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
	
	// functions
	this.Show = function() {
		this.rightContact = false;
		this.leftContact = false;
		this.bottomContact = false;
		spToDrop = dropY;

		ctx.fillStyle = this.color; //"rgb(0, 250,0)"; // "rgb(250,0,0)";
		for (i = 0; i < this.sqArrey.length; i++) {
			ctx.fillRect (	unit*(this.X0 + this.sqArrey[i].x), 
							unit*(this.Y0 + this.sqArrey[i].y) + this.Yshift,
							unit, unit);
			
			if (!this.rightContact && this.sqArrey[i].IsRightContact(this.X0, this.Y0)) 
				this.rightContact = true;
				
			if (!this.leftContact && this.sqArrey[i].IsLeftContact(this.X0, this.Y0)) 
				this.leftContact = true;
				
			if (!this.bottomContact && this.sqArrey[i].IsBottomContact(this.X0, this.Y0, this.Yshift)) 
				this.bottomContact = true;
		}
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
				if (this.Yshift > unit) {
					this.Yshift -= unit;
					this.Y0++;
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
						this.Y0++;
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
			var xOld = this.sqArrey[i].x;
			var yOld = this.sqArrey[i].y;
			
			//xNew = xR + (yR-yOld)
			this.sqArrey[i].x = this.xR + this.yR - yOld;
			
			//yNew = yR + (xOld-xR)
			this.sqArrey[i].y = this.yR + xOld - this.xR;
		}
	}
	
	this.AlignYpos = function() {
		//var rest = this.brickY % unit;
		//this.brickY += rest ? unit-rest : 0;
		
		if (this.Yshift > 0) {
			this.Y0++;
		}
		this.Yshift = 0;
	}
	
	this.OnSettle = function() {
		//NextBrick();
		gOnSettle();
	}
}
// --------------- </class Brick> --------------- 
