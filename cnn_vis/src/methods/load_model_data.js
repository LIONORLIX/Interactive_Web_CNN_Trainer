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
    let layerConv2DIndex = 0;

    
    for (const [index, layer] of model.layers.entries()) { // can't use forEach() because 'await' must stay inside async function
        const layerType = layer.getClassName();
        let neuronCount = -1;

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

        if (layerType === 'Conv2D') {

            neuronCount = layer.filters;
            
            for (let i = 0; i < layer.filters; i++) {

                let tensorValue = [];

                // console.log('l1:'+layerTensorValue[0]);
                // console.log('l2:'+layerTensorValue[0].length);
                // console.log('l3:'+layerTensorValue[0][0].length);
                // console.log(layerTensorValue[0][0]);
                // console.log('neuron:'+layerTensorValue[0][0][i]);
                

                for (let x=0; x<layerTensorValue[0].length; x++){
                    tensorValue.push([]);
                    for (let y=0; y<layerTensorValue[0][x].length;y++){
                        tensorValue[x].push(layerTensorValue[0][x][y][i]);
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
                    'layerConv2DIndex': layerConv2DIndex,
                    'tensor': tensorValue
                })
            }
            layerConv2DIndex += 1;
        }

        if (layerType === 'Conv2D') {
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
                'layerConv2DIndex': layerConv2DIndex,
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
                'layerConv2DIndex': layerConv2DIndex,
                'tensor': layerTensorValue
            })
        }

    };

    console.log('Model loaded successfully');
    // console.log(layerJSON)
    return { layerJSON: layerJSON, neuronJSON: neuronJSON };

};
