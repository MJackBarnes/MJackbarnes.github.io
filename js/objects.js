function Pixel(col, row){
  this.col = col;
  this.row = row;
  this.show = function(){
    fill(40, 40, 100);
    rect(this.col * unit, this.row * unit, unit, unit);
  }
  this.clear = function(){
    fill(51, 51, 51);
    rect(this.col * unit, this.row * unit, unit, unit);
  }
}

function Image(pixels){
	this.p = [];
	
	this.prep = function(){
		for(var i = 0; i < resolution; i ++){
			this.p[i] = [];
			for(var j = 0; j < resolution; j ++){
				this.p[i][j] = false;
			}
		}

		for(var i = 0; i < pixels.length; i ++){
			this.p[pixels[i].col][pixels[i].row] = true;
		}
	}
}

function TrainingImage(image, num){
	this.input = image.p;
	this.output = num;
}