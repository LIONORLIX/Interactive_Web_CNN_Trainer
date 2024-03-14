// Author: Xiang Li
// UAL Student ID: 23009641
//
// For me this is the most challenging part of the entire project
// Get information of a TensorFlow.js model and output of inner layer, convert them to JSON and array which can be read by visualization component drew by d3.js
//
// Reference:
// https://www.tensorflow.org/js/tutorials/setup
// https://observablehq.com/@tvirot/machine-learning-in-javascript-with-tensorflow-js-part-iii
// https://www.tensorflow.org/js/guide/models_and_layers
// https://www.codecademy.com/resources/docs/javascript/objects/entries
// https://stackoverflow.com/questions/736590/add-new-attribute-element-to-json-object-using-javascript
// https://stackoverflow.com/questions/46715484/correct-async-function-export-in-node-js
// https://stackoverflow.com/questions/50942677/tensorflowjs-how-to-get-inner-layer-output-in-a-cnn-prediction
// https://stackoverflow.com/questions/49869302/get-the-value-of-an-item-in-a-tensor-in-tensorflow-js
// https://stackoverflow.com/questions/50091466/getting-weights-from-tensorflow-js-neural-network

import * as tf from '@tensorflow/tfjs';

export async function loadModelData(model, inputDataUnreshaped) {

    // initialize JSON
    let layerJSON = [];
    let neuronJSON = [];

    // initialize information
    let layerConv2DCnt = 0;
    let layerPoolingCnt = 0;
    let layerDenseCnt = 0;
    let prevNeuronCount = 1;
    let neuronCount = -1;
    let sizeCnt = 28;


    // reshape the input image picked from MNIST dataset, now it is a Tensor
    let inputData = inputDataUnreshaped.reshape([1, 28, 28, 1]);
    // convert Tensor to array
    let originalImage = await inputData.array();

    // loop to get each layer
    for (const [index, layer] of model.layers.entries()) { // can't use forEach() because 'await' must be put inside async function

        const layerType = layer.getClassName();
        let layerWeights;
        let layerBias;

        // create an internal layer model to get the tensor output of inner layer
        const internalLayerModel = tf.model({
            inputs: model.input,
            outputs: layer.output
        });

        // Get the actual data tensor from this intermediate layer, and now it is still a Tensor
        const internalImageTensor = internalLayerModel.predict(inputData);

        // convert Tensor to array
        // each array is structured as a 2D array, but each item in this 2D array is an 1D array which stores values of every neuron in this position
        // structure of weights and bias are similar to inner layer output
        let layerTensorValue = await internalImageTensor.array();

        if (layerType == 'Conv2D') {

            layerConv2DCnt += 1; // get amount of ConV layer
            neuronCount = layer.filters; // get filter amount

            // get weights (also called filter or kernel in ConV layer) and bias
            layerWeights = await layer.getWeights()[0].array();
            layerBias = await layer.getWeights()[1].array();

        } else if (layerType == 'MaxPooling2D') {

            layerPoolingCnt += 1; // get amount of pooling layer

        } else if (layerType == 'Dense') {

            layerDenseCnt += 1; // get amount of Dense layer
            neuronCount = 10; // get output class amount

        }else if (layerType == 'Flatten'){
            // skip Flatten layer
        }

        // seperate single neuron's value from layer output
        for (let i = 0; i < neuronCount; i++) {

            let tensorValue2D = [];
            let tensorValue1D = [];

            if (layerType == 'Flatten'){
                // skip Flatten layer
                continue;

            }else if (layerType == 'Dense'){
                //dense layer's output is actually a 1D array, I reuse the 2D loop below and change the range
                for (let x = 0; x < 1; x++) { 
                    tensorValue2D.push([]);
                    for (let y = 0; y < 1; y++) {
                        tensorValue2D[x].push(layerTensorValue[0][i]);
                        tensorValue1D.push(layerTensorValue[0][i]);
                    }
                }
            }else{  
                // use 2D loop to set both 1D array and 2D array of neuron output
                for (let x = 0; x < layerTensorValue[0].length; x++) {
                    tensorValue2D.push([]);
                    for (let y = 0; y < layerTensorValue[0][x].length; y++) {
                        tensorValue2D[x].push(layerTensorValue[0][x][y][i]);
                        tensorValue1D.push(layerTensorValue[0][x][y][i]);
                    }
                }
            }

            // add neuron info to neuronJSON
            neuronJSON.push({
                'layerInput': layer.input,          // layerInput, a tensor
                'layerOutput': layer.output,        // layerOutput, a tensor
                'kernelSize': layer.kernelSize,
                'activation': layer.activation,
                'layerName': layer.name,
                'layerIndex': index,                // index of layer in the model
                'neuronIndex': i,                   // index of neuron in one layer
                'layerType': layerType,
                'layerConv2DCnt': layerConv2DCnt,   // Conv2D layer amount
                'layerPoolingCnt': layerPoolingCnt, // pooling layer amount
                'layerDenseCnt': layerDenseCnt,     // dense layer amount
                'sizeCnt': sizeCnt,                 // count pixel height of each layer to draw visualization
                'tensor2D': tensorValue2D,          // 2D array of one neuron's output
                'tensor1D': tensorValue1D,          
                'prevNeuronCount': prevNeuronCount, // amount of neuron in the last layer
                'weights':layerWeights,
                'bias': layerBias
            })
        }

        // record amount of neuron in the last layer
        prevNeuronCount = neuronCount;

        // add layer info to layerJSON
        if (layerType == 'Conv2D') {
            neuronCount = layer.filters;
            layerJSON.push({
                'layerInput': layer.input,
                'layerOutput': layer.output,
                'KernelSize': layer.kernelSize,
                'activation': layer.activation,
                'layerName': layer.name,
                'layerIndex': index,                // index of layer in the model
                'layerType': layerType,
                'neuronCount': neuronCount,         // amount of neuron in current layer
                'layerConv2DCnt': layerConv2DCnt,   // Conv2D layer amount
                'tensor': layerTensorValue          // array of one layer's output
            })

        } else {
            layerJSON.push({
                'layerInput': layer.input,
                'layerOutput': layer.output,
                'KernelSize': layer.kernelSize,
                'activation': layer.activation,
                'layerName': layer.name,
                'layerIndex': index,                // index of layer in the model
                'layerType': layerType,
                'layerConv2DCnt': layerConv2DCnt,   // Conv2D layer amount
                'tensor': layerTensorValue          // array of one layer's output
            })
        }

        // count pixel height of each layer to draw visualization
        if (layerType == 'Conv2D') {
            sizeCnt += layerTensorValue[0].length;
        } else if (layerType == 'MaxPooling2D') {
            sizeCnt += layerTensorValue[0].length;
        } else if (layerType == 'Dense') {
            sizeCnt += 2;
            neuronCount = layerTensorValue[0].length
        }

    };

    console.log('Model loaded successfully');
    return { layerJSON: layerJSON, neuronJSON: neuronJSON, originalImage: originalImage };

};
