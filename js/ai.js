
//Makes the neural network object
function makeNet(){
    gets()
    const model = tf.sequential();
    model.add(tf.layers.conv2d({
      inputShape: [resolution, resolution, 1],
      shape: [resolution, resolution,1],
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
    net = model;
}

//prepares data for use in the trainig of network net
function prepareData(){
    testData = toDataFormat(Array.from(testData));
    trainData = toDataFormat(Array.from(tData));
}

// data storage object
function Data(){
    this.xs = [];
    this.labels = [];
}

function toDataFormat(data){
    var d = new Data();
    for(var i = 0; i < data.length; i ++){
        d.xs[d.xs.length] = toTensor(data[i].input);
        d.labels[d.labels.length] = data[i].output;
    }
    d.xs = tf.tensor(d.xs, [d.xs.length, 1]);
    return d;
}

function toTensor(data){
    let _d = data.flat();
    console.log(_d);
    let d = tf.tensor(_d, [resolution, resolution], 'bool')
    return d.shape = [resolution, resolution] ;
}
  
async function trainNet(model){
    prepareData();
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
            await tf.nextFrame();
        },
        onEpochEnd: async (epoch, logs) => {
            valAcc = logs.val_acc;
            await tf.nextFrame();
        }
        }
    });
    const testResult = model.evaluate(testData.xs, testData.labels);
    const testAccPercent = testResult[1].dataSync()[0] * 100;
    const finalValAccPercent = valAcc * 100;
}
