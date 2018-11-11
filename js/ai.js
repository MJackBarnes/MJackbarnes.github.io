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
    net = model;
}

function prepareData(){
    gets();
    testData = toDataFormat(testImages);
    trainData = toDataFormat(tData);
}

function toDataFormat(data){
    this.xs = [];
    this.labels = []
    for(var i = 0; i < data.length; i ++){
        this.xs[this.xs.length] = data[i].input;
        this.labels[this.labels.length] = data[i].output;
    }
}
  
async function trainNet(model, onIteration){
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