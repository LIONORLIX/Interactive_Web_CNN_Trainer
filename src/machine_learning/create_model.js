// Code based on: https://codelabs.developers.google.com/codelabs/tfjs-training-classfication?hl=en#4
//
// Modified by: Xiang Li
// UAL Student ID: 23009641
//
// Create a TensorFlow.js model based on configuration info set by user

import * as tf from '@tensorflow/tfjs';

export function createModel(modelConfig) { // I add a parameter to pass an array and this function can generate a model based on this array

  const model = tf.sequential();

  // set up input size
  const IMAGE_WIDTH = 28;
  const IMAGE_HEIGHT = 28;
  const IMAGE_CHANNELS = 1;

  // loop to get info from array and configure each Conv2D layer
  for (let i=0; i<modelConfig.length;i++){
    if (modelConfig[i].layerType == 'Conv2D'){
      if (i==0){
        model.add(tf.layers.conv2d({
          inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
          kernelSize: modelConfig[i].kernelSize,
          filters: modelConfig[i].filters,
          strides: modelConfig[i].strides,
          activation: modelConfig[i].activation,
          kernelInitializer: modelConfig[i].kernelInitializer
        }));
      }else{
        model.add(tf.layers.conv2d({
          kernelSize: modelConfig[i].kernelSize,
          filters: modelConfig[i].filters,
          strides: modelConfig[i].strides,
          activation: modelConfig[i].activation,
          kernelInitializer: modelConfig[i].kernelInitializer
        }));
      }

      if (modelConfig[i].isMaxPooling){ // add a pooling layer if user turned on MaxPooling
        model.add(tf.layers.maxPooling2d({ 
          poolSize: modelConfig[i].poolSize, 
          strides: modelConfig[i].strides 
        }));
      }

    }
  }

  // add flatten layer
  model.add(tf.layers.flatten());

  // output class (i.e. 0, 1, 2, 3, 4, 5, 6, 7, 8, 9).
  const NUM_OUTPUT_CLASSES = 10;
  model.add(tf.layers.dense({
    units: NUM_OUTPUT_CLASSES,
    kernelInitializer: 'varianceScaling',
    activation: 'softmax'
  }));

  // Choose an optimizer, loss function and accuracy metric,
  // then compile and return the model
  const optimizer = tf.train.adam();
  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}


