// max sizes of brick
var maxX = 5;
var maxY = 5;

// color array
var rainbowColor = getRainbow();

function createRandomBrick() {
	var width = getRandomInt(1, maxX);
	var height = getRandomInt(1, maxY);
	
	var brk = new Brick();
	
	// color
	brk.color = rainbowColor[getRandomInt(0, rainbowColor.length-1)];
	
	// position
	brk.X0 = Math.round(dimX/2) - Math.ceil(width/2);
	brk.Y0 = dimY-1;
	
	// tiles
	var i = 0;
	for (x = 0; x < width; x++) {
		for (y = 0; y < height; y++) {
			if ( RandomFalseTrue() ) {
					brk.sqArr_rotated.push(new Square());
					brk.sqArrey.push(new Square());
					brk.sqArrey[i].x = x;
					brk.sqArrey[i].y = y;
					
					i++;
			}
		}
	}
	
	if ( i == 0) { // no tile were added; add one at least
		brk.sqArr_rotated.push(new Square());
		brk.sqArrey.push(new Square());
		brk.sqArrey[0].x = getRandomInt(0, width-1);
		brk.sqArrey[0].y = getRandomInt(0, height-1);
	}
	
	// rotation center
	var ind = Math.floor(brk.sqArrey.length/2); // assume mid of array ~= mid of brick
	
	brk.xR = brk.sqArrey[ind].x;
    brk.yR = brk.sqArrey[ind].y;
	
	// random 0.5 offset
	if (brk.sqArrey.length > 1 && RandomFalseTrue() ) {
		brk.xR += 0.5;
		brk.yR += 0.5;
	}
	
	return brk;
}

function RandomFalseTrue() {
	if ( Math.random() > 0.5 )
		return true;
	
	return false;
}

// rainbow colors; from http://javascript.ru/blog/poorking/Interesnyj-effekt-s-pomoshu-canvas
function getRainbow(){
	var rgb = [255,0,0];
	var rainbow = [];
	function rgbArray2Rgba(rgbArray){
		return "rgba("+rgbArray[0]+", "+rgbArray[1]+", "+rgbArray[2]+", 1)";
	}
	for(var i = 0; i < 3; i ++){
		if(i + 1 < 3){
			while(rgb[i + 1] < 255){		
				rainbow.push(rgbArray2Rgba(rgb));
				rgb[i + 1] ++;
			}
		} else {
			while(rgb[0] < 255){
				rainbow.push(rgbArray2Rgba(rgb));
				rgb[0] ++;
			}
		}
		while(rgb[i] > 0){
			rainbow.push(rgbArray2Rgba(rgb));
			rgb[i] --;
		}
	}		
	return rainbow;
}
