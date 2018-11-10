var canvas;
var x = 0;
var y = 0;
var unit = 0;
var pixels = [];
var cPixels = [];
var guess = document.getElementById("guess");
var tImages = [];
var database = firebase.database();
const resolution = 28;
var trainedNet;

function setup(){
  canvas = createCanvas(600, 600);
  canvas.class('center');
  background(51);
  unit = width/resolution;
  console.log("Unit is: " + unit);
  for(var i = 0; i < resolution; i ++){
    pixels[i] = [];
  }
  for(var i = 0; i < resolution; i ++){
    for(var j = 0; j < resolution; j ++){
      pixels[i][j] = new Pixel(i, j);
    }
  }
}

function getTrainingData(){
	return database.ref("Training").once('value').snapshot;
}

function makeTrainedNet(){
	var net = new brain.NeuralNetwork();
  net.train([{input: "red", output: 1}, {input:"green", output: 2}, {input:"blue", output: 3}]);
  trainedNet = net.toFunction();
  console.log("Trained");
}

function drawSave(save){
	for(var i = 0; i <  save.img.length; i ++){
		for(var j = 0; j < save.img[i].length; j ++){
			if(save.img[i][j]){
				cPixels[cPixels.length] = new Pixel(i, j);
			}
		}
	}
	for(var i = 0; i < cPixels.length; i ++){
		cPixels[i].show();
	}
	
}

function draw(){
  noStroke();
  x = Math.ceil(mouseX/unit) - 1;
  y = Math.ceil(mouseY/unit) - 1;
  push();
  stroke(10);
  drawGrid();
  pop();
}
function clears(){
  canvas.background(51);
  cPixels = [];
}
function trains(){
	img = new Image(cPixels);
	img.prep();
	console.log(JSON.stringify(img));
	tImg = new TrainingImage(img, prompt("What number is this"));
	tImages[tImages.length] = tImg;
	clears();
}
function saves(){
	for(var i = 0; i < tImages.length; i++){
		database.ref("Training").push(JSON.stringify(tImages[i]));
	}
	alert("Sent Training Data");
}

function drawGrid(){
  for(var i = 0; i < resolution; i ++){
    line(i * unit, 0, i * unit, height);
    line(0, unit * i, width, unit * i);
  }
}

