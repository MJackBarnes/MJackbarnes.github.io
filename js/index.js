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
const a = tf.tensor()
const testImages;

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

function makeNet(){
  const model = tf.sequential();
  model.add(tf.layers.conv2d({
    inputShape: [resolution, resolution, 1],
    kernelSize: 3,
    filters: 16,
    activation: 'relu'
  }));
  model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
  model.add(tf.layers.conv2d({kernelSize: 3, filters: 32, activation: 'relu'}));
  model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
  model.add(tf.layers.conv2d({kernelSize: 3, filters: 32, activation: 'relu'}));
  model.add(tf.layers.flatten({}));
  model.add(tf.layers.dense({units: 64, activation: 'relu'}));
  model.add(tf.layers.dense({units: 10, activation: 'softmax'}));
  return model;
}

function trainNet(model, onIteration){
  const LEARNING_RATE = 0.01;
  const optimizer = 'rmsprop';
  model.compile({
    optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });
  const batchSize = 320;
  const validationSplit = 0.15;
  let trainBatchCount = 0;
  const trainData = toDataFormat(tImages);
  const testData = toDataFormat(testImages);
  const trainEpochs = 10
  const totalNumBatches = Math.ceil((resolution ^ 2) * (1 - validationSplit) / batchSize) * trainEpochs;
  let valAcc;
  await model.fit(trainData.xs, trainData.labels, {
    batchSize,
    validationSplit,
    epochs: trainEpochs,
    callbacks: {
      onBatchEnd: async (batch, logs) => {
        trainBatchCount++;
        if (onIteration && batch % 10 === 0) {
          onIteration('onBatchEnd', batch, logs);
        }
        await tf.nextFrame();
      },
      onEpochEnd: async (epoch, logs) => {
        valAcc = logs.val_acc;
        if (onIteration) {
          onIteration('onEpochEnd', epoch, logs);
        }
        await tf.nextFrame();
      }
    }
  });
  const testResult = model.evaluate(testData.xs, testData.labels);
  const testAccPercent = testResult[1].dataSync()[0] * 100;
  const finalValAccPercent = valAcc * 100;
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

