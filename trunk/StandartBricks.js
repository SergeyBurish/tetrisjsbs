var brk;

function createStandartBrick(block) {
	switch (block) {
		case 0: return I();
		case 1: return O();
		case 2: return T();
		case 3: return J();
		case 4: return L();
		case 5: return S();
		case 6: return Z();
	}
}

// o o o o
function I() {
	brk = new Brick();
	
	brk.color = "rgb(100, 255, 255)"; // blue
	
	brk.X0 = Math.round(dimX/2) - 2;
	brk.Y0 = dimY-1;
	
	brk.xR = 1;
    brk.yR = 0;

	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[0].x = 0;
	brk.sqArrey[0].y = 0;
	
	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[1].x = 1;
	brk.sqArrey[1].y = 0;	

	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[2].x = 2;
	brk.sqArrey[2].y = 0;	
	
	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[3].x = 3;
	brk.sqArrey[3].y = 0;
	
	return brk;
}

// o o
// o o
function O() {
	brk = new Brick();
	
	brk.color = "rgb(255, 255, 100)"; // yellow
	
	brk.X0 = Math.round(dimX/2) - 1;
	brk.Y0 = dimY-1;
	
	brk.xR = 0.5;
    brk.yR = 0.5;

	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[0].x = 0;
	brk.sqArrey[0].y = 0;
	
	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[1].x = 1;
	brk.sqArrey[1].y = 0;	

	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[2].x = 0;
	brk.sqArrey[2].y = 1;	
	
	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[3].x = 1;
	brk.sqArrey[3].y = 1;
	
	return brk;
}

// o o o
//   o
function T() {
	brk = new Brick();
	
	brk.color = "rgb(230, 50, 255)"; // lilac
	
	brk.X0 = Math.round(dimX/2) - 2;
	brk.Y0 = dimY-1;
	
	brk.xR = 1;
    brk.yR = 0;

	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[0].x = 0;
	brk.sqArrey[0].y = 0;
	
	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[1].x = 1;
	brk.sqArrey[1].y = 0;	

	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[2].x = 2;
	brk.sqArrey[2].y = 0;	
	
	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[3].x = 1;
	brk.sqArrey[3].y = 1;
	
	return brk;
}

// o o o
//     o
function J() {
	brk = new Brick();
	
	brk.color = "rgb(0, 0, 255)"; // deep blue
	
	brk.X0 = Math.round(dimX/2) - 2;
	brk.Y0 = dimY-1;
	
	brk.xR = 1;
    brk.yR = 0;

	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[0].x = 0;
	brk.sqArrey[0].y = 0;
	
	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[1].x = 1;
	brk.sqArrey[1].y = 0;	

	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[2].x = 2;
	brk.sqArrey[2].y = 0;	
	
	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[3].x = 2;
	brk.sqArrey[3].y = 1;
	
	return brk;
}

// o o o
// o
function L() {
	brk = new Brick();
	
	brk.color = "rgb(255, 145, 35)"; // brown
	
	brk.X0 = Math.round(dimX/2) - 2;
	brk.Y0 = dimY-1;
	
	brk.xR = 1;
    brk.yR = 0;

	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[0].x = 0;
	brk.sqArrey[0].y = 0;
	
	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[1].x = 1;
	brk.sqArrey[1].y = 0;	

	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[2].x = 2;
	brk.sqArrey[2].y = 0;	
	
	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[3].x = 0;
	brk.sqArrey[3].y = 1;
	
	return brk;
}

//   o o
// o o
function S() {
	brk = new Brick();
	
	brk.color = "rgb(0, 255, 0)"; // green
	
	brk.X0 = Math.round(dimX/2) - 2;
	brk.Y0 = dimY-1;
	
	brk.xR = 1;
    brk.yR = 0;

	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[0].x = 1;
	brk.sqArrey[0].y = 0;
	
	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[1].x = 2;
	brk.sqArrey[1].y = 0;	

	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[2].x = 0;
	brk.sqArrey[2].y = 1;	
	
	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[3].x = 1;
	brk.sqArrey[3].y = 1;
	
	return brk;
}

// o o
//   o o
function Z() {
	brk = new Brick();
	
	brk.color = "rgb(255, 0, 0)"; // red
	
	brk.X0 = Math.round(dimX/2) - 2;
	brk.Y0 = dimY-1;
	
	brk.xR = 1;
    brk.yR = 0;

	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[0].x = 0;
	brk.sqArrey[0].y = 0;
	
	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[1].x = 1;
	brk.sqArrey[1].y = 0;	

	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[2].x = 1;
	brk.sqArrey[2].y = 1;	
	
	brk.sqArr_rotated.push(new Square());
	brk.sqArrey.push(new Square());
	brk.sqArrey[3].x = 2;
	brk.sqArrey[3].y = 1;
	
	return brk;
}
