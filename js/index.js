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
const shape = [resolution, resolution];
var tData;
var logEnabled = false;
var net;
var trainData;
var testData;
console.log("To build a neural net type the command newNet() into this console");

function setup(){
  canvas = createCanvas(600, 600);
  canvas.class('center');
  background(51);
  unit = width/resolution;
  dLog("Unit is: " + unit);
  for(var i = 0; i < resolution; i ++){
    pixels[i] = [];
  }
  for(var i = 0; i < resolution; i ++){
    for(var j = 0; j < resolution; j ++){
      pixels[i][j] = new Pixel(i, j);
    }
  }
}

function newNet(){
  makeNet();
  trainNet(net);
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
	dLog(JSON.stringify(img));
	tImg = new TrainingImage(img, prompt("What number is this"));
	tImages[tImages.length] = tImg;
	clears();
}

function setTData(data){
  tData = data;
  for(var i = 0; i < tData.length; i ++){
    tData[i].output = parseInt(tData[i].output, 10);
  }
  tData = Array.from(tData);
  dLog(tData);
}

function saves(){
  gets();
  tData = [tData[0]].concat(tImages, tData);
  database.ref("TrainingData").set(tData);
  dLog(tData);
}

function gets(){
  database.ref("TrainingData").once('value').then(function(snapshot){setTData(snapshot.val())});
  database.ref("TestData").once('value').then(function(snapshot){setTestData(snapshot.val())});
  dLog(tData);
}

function setTestData(data){
  testData = data;
  for(var i = 0; i < testData.length; i ++){
    testData[i].output = parseInt(testData[i].output, 10);
  }
  testData = Array.from(testData);
  dLog(testData);
}

function saveAsTestData(){
  database.ref("TestData").set(tImages);
}

function drawGrid(){
  for(var i = 0; i < resolution; i ++){
    line(i * unit, 0, i * unit, height);
    line(0, unit * i, width, unit * i);
  }
}

