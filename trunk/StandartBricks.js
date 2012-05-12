
function createStandartBrick(block) {
	switch (block) {
		case 0: I(); break;
		case 1: O(); break;
		case 2: T(); break;
		case 3: J(); break;
		case 4: L(); break;
		case 5: S(); break;
		case 6: Z(); break;
	}
}

// o o o o
function I() {
	brick = new Brick();
	
	brick.color = "rgb(100, 255, 255)"; // blue
	
	brick.X0 = Math.round(dimX/2) - 2;
	brick.Y0 = dimY-1;
	
	brick.xR = 1;
    brick.yR = 0;

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
	brick.sqArrey[2].x = 2;
	brick.sqArrey[2].y = 0;	
	
	brick.sqArr_rotated.push(new Square());
	brick.sqArrey.push(new Square());
	brick.sqArrey[3].x = 3;
	brick.sqArrey[3].y = 0;
}

// o o
// o o
function O() {
	brick = new Brick();
	
	brick.color = "rgb(255, 255, 100)"; // yellow
	
	brick.X0 = Math.round(dimX/2) - 1;
	brick.Y0 = dimY-1;
	
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
}

// o o o
//   o
function T() {
	brick = new Brick();
	
	brick.color = "rgb(230, 50, 255)"; // lilac
	
	brick.X0 = Math.round(dimX/2) - 2;
	brick.Y0 = dimY-1;
	
	brick.xR = 1;
    brick.yR = 0;

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
	brick.sqArrey[2].x = 2;
	brick.sqArrey[2].y = 0;	
	
	brick.sqArr_rotated.push(new Square());
	brick.sqArrey.push(new Square());
	brick.sqArrey[3].x = 1;
	brick.sqArrey[3].y = 1;
}

// o o o
//     o
function J() {
	brick = new Brick();
	
	brick.color = "rgb(0, 0, 255)"; // deep blue
	
	brick.X0 = Math.round(dimX/2) - 2;
	brick.Y0 = dimY-1;
	
	brick.xR = 1;
    brick.yR = 0;

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
	brick.sqArrey[2].x = 2;
	brick.sqArrey[2].y = 0;	
	
	brick.sqArr_rotated.push(new Square());
	brick.sqArrey.push(new Square());
	brick.sqArrey[3].x = 2;
	brick.sqArrey[3].y = 1;
}

// o o o
// o
function L() {
	brick = new Brick();
	
	brick.color = "rgb(255, 145, 35)"; // brown
	
	brick.X0 = Math.round(dimX/2) - 2;
	brick.Y0 = dimY-1;
	
	brick.xR = 1;
    brick.yR = 0;

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
	brick.sqArrey[2].x = 2;
	brick.sqArrey[2].y = 0;	
	
	brick.sqArr_rotated.push(new Square());
	brick.sqArrey.push(new Square());
	brick.sqArrey[3].x = 0;
	brick.sqArrey[3].y = 1;
}

//   o o
// o o
function S() {
	brick = new Brick();
	
	brick.color = "rgb(0, 255, 0)"; // green
	
	brick.X0 = Math.round(dimX/2) - 2;
	brick.Y0 = dimY-1;
	
	brick.xR = 1;
    brick.yR = 0;

	brick.sqArr_rotated.push(new Square());
	brick.sqArrey.push(new Square());
	brick.sqArrey[0].x = 1;
	brick.sqArrey[0].y = 0;
	
	brick.sqArr_rotated.push(new Square());
	brick.sqArrey.push(new Square());
	brick.sqArrey[1].x = 2;
	brick.sqArrey[1].y = 0;	

	brick.sqArr_rotated.push(new Square());
	brick.sqArrey.push(new Square());
	brick.sqArrey[2].x = 0;
	brick.sqArrey[2].y = 1;	
	
	brick.sqArr_rotated.push(new Square());
	brick.sqArrey.push(new Square());
	brick.sqArrey[3].x = 1;
	brick.sqArrey[3].y = 1;
}

// o o
//   o o
function Z() {
	brick = new Brick();
	
	brick.color = "rgb(255, 0, 0)"; // red
	
	brick.X0 = Math.round(dimX/2) - 2;
	brick.Y0 = dimY-1;
	
	brick.xR = 1;
    brick.yR = 0;

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
	brick.sqArrey[2].x = 1;
	brick.sqArrey[2].y = 1;	
	
	brick.sqArr_rotated.push(new Square());
	brick.sqArrey.push(new Square());
	brick.sqArrey[3].x = 2;
	brick.sqArrey[3].y = 1;
}
