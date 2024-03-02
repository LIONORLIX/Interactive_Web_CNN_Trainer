// https://www.tensorflow.org/js/tutorials/setup
// https://observablehq.com/@tvirot/machine-learning-in-javascript-with-tensorflow-js-part-iii
// https://www.tensorflow.org/js/guide/models_and_layers
// https://stackoverflow.com/questions/736590/add-new-attribute-element-to-json-object-using-javascript
// https://stackoverflow.com/questions/46715484/correct-async-function-export-in-node-js
// https://stackoverflow.com/questions/50942677/tensorflowjs-how-to-get-inner-layer-output-in-a-cnn-prediction
// https://stackoverflow.com/questions/49869302/get-the-value-of-an-item-in-a-tensor-in-tensorflow-js

import * as tf from '@tensorflow/tfjs';

export async function loadModel(model, inputData) {

    let layerJSON = [];
    let neuronJSON = [];
    let layerConv2DCnt = 0;
    let layerPoolingCnt = 0;
    let layerDenseCnt = 0;

    let prevNeuronCount = 1;
    let neuronCount = -1;

    let sizeCnt = 28;

    // let convCnt = 0;
    // let poolingCnt = 0;
    // let flattenCnt = 0;
    // let softmaxCnt = 0;

    let historyLayer = [0, 0, 0, 0];
    let historySize = [];


    for (const [index, layer] of model.layers.entries()) { // can't use forEach() because 'await' must stay inside async function

        const layerType = layer.getClassName();

        const reshapedInputData = inputData.reshape([1, 28, 28, 1]);
        const internalLayerModel = tf.model({
            inputs: model.input,
            outputs: layer.output
        });

        // Get the actual data tensor from this intermediate layer
        const internalImageTensor = internalLayerModel.predict(reshapedInputData);

        // turn tensor to array
        let layerTensorValue = await internalImageTensor.array();

        // console.log(layerTensorValue);

        if (layerType == 'Conv2D') {

            layerConv2DCnt += 1;
            neuronCount = layer.filters;
            sizeCnt += layer.input.shape[1];

        } else if (layerType == 'MaxPooling2D') {

            layerPoolingCnt += 1;
            sizeCnt += layer.input.shape[1];

        } else if (layerType == 'Dense') {

            layerDenseCnt += 1;
            sizeCnt += 2;
            neuronCount = layerTensorValue[0].length
        }


        for (let i = 0; i < neuronCount; i++) {

            let tensorValue2D = [];
            let tensorValue1D = [];

            if (layerType == 'Dense'){
                
                for (let x = 0; x < 1; x++) {
                    tensorValue2D.push([]);
                    for (let y = 0; y < 1; y++) {
                        tensorValue2D[x].push(layerTensorValue[0][i]);
                        tensorValue1D.push(layerTensorValue[0][i]);
                    }
                }
            }else{
                
                for (let x = 0; x < layerTensorValue[0].length; x++) {
                    tensorValue2D.push([]);
                    for (let y = 0; y < layerTensorValue[0][x].length; y++) {
                        tensorValue2D[x].push(layerTensorValue[0][x][y][i]);
                        tensorValue1D.push(layerTensorValue[0][x][y][i]);
                    }
                }
            }

            neuronJSON.push({
                'layerInput': layer.input,
                'layerOutput': layer.output,
                'kernelSize': layer.kernelSize,
                'activation': layer.activation,
                'layerName': layer.name,
                'layerIndex': index,
                'neuronIndex': i,
                'layerType': layerType,
                'layerConv2DCnt': layerConv2DCnt,
                'layerPoolingCnt': layerPoolingCnt,
                'layerDenseCnt': layerDenseCnt,
                'sizeCnt': sizeCnt,
                'tensor2D': tensorValue2D,
                'tensor1D': tensorValue1D,
                'prevNeuronCount': prevNeuronCount,
            })
        }
        prevNeuronCount = neuronCount;
        // layerConv2DCnt += 1;



        if (layerType == 'Conv2D') {
            neuronCount = layer.filters;
            layerJSON.push({
                'layerInput': layer.input,
                'layerOutput': layer.output,
                'KernelSize': layer.kernelSize,
                'activation': layer.activation,
                'layerName': layer.name,
                'layerIndex': index,
                'layerType': layerType,
                'neuronCount': neuronCount,
                'layerConv2DCnt': layerConv2DCnt,
                'tensor': layerTensorValue
            })

        } else {
            layerJSON.push({
                'layerInput': layer.input,
                'layerOutput': layer.output,
                'KernelSize': layer.kernelSize,
                'activation': layer.activation,
                'layerName': layer.name,
                'layerIndex': index,
                'layerType': layerType,
                'layerConv2DCnt': layerConv2DCnt,
                'tensor': layerTensorValue
            })
        }

    };

    console.log('Model loaded successfully');
    // console.log(layerJSON)
    return { layerJSON: layerJSON, neuronJSON: neuronJSON };

};
