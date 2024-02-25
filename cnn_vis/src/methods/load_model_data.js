// https://www.tensorflow.org/js/tutorials/setup
// https://observablehq.com/@tvirot/machine-learning-in-javascript-with-tensorflow-js-part-iii
// https://www.tensorflow.org/js/guide/models_and_layers
// https://stackoverflow.com/questions/736590/add-new-attribute-element-to-json-object-using-javascript
// https://stackoverflow.com/questions/46715484/correct-async-function-export-in-node-js
// https://stackoverflow.com/questions/50942677/tensorflowjs-how-to-get-inner-layer-output-in-a-cnn-prediction

import * as tf from '@tensorflow/tfjs';

import { showExamples,getImageTensor } from './show_image_data.js'


export async function loadModel(model,inputData){

    // console.log(imageTensor);
    // try {

        let layerJSON = [];
        let neuronJSON = [];
        let layerConv2DIndex = 0;

        model.layers.forEach((layer, index) => {
            const layerType = layer.getClassName();
            let neuronCount = -1;

            if (layerType === 'Conv2D') {
                neuronCount = layer.filters;
                for (let i=0; i<neuronCount; i++){
                    neuronJSON.push({
                        'layerInput': layer.input,
                        'layerOutput': layer.output,
                        'kernelSize': layer.kernelSize,
                        'activation': layer.activation,
                        'layerName': layer.name,
                        'layerIndex': index,
                        'neuronIndex': i,
                        'layerType': layerType,
                        'layerConv2DIndex': layerConv2DIndex
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
                    'layerConv2DIndex': layerConv2DIndex
                })

                

                // const inputShape = [1, 28, 28, 1]; // Example for a single image of shape 28x28 with 1 channel
                

                // const inputData2 = tf.zeros(inputShape);

                console.log('This is 1111'+inputData);
                // console.log('This is 1111111'+inputData2);

                const reshapedInputData = inputData.reshape([1, 28, 28, 1]);

                const intermediateLayerName = layer.name;
                const intermediateLayerModel = tf.model({
                    inputs: model.input,
                    outputs: model.getLayer(intermediateLayerName).output
                });

                // Now, you can get the actual data tensor from this intermediate layer
                const intermediateOutputData = intermediateLayerModel.predict(reshapedInputData);

                console.log(intermediateOutputData);
                const normalizedData = intermediateOutputData.sub(intermediateOutputData.min()).div(intermediateOutputData.max().sub(intermediateOutputData.min()));

                const toVisualize = normalizedData.squeeze().slice([0, 0, 0], [-1, -1, 1]).squeeze();

            // Visualize on canvas
            const canvas = document.getElementById('hahaha');
            tf.browser.toPixels(toVisualize, canvas);

            // Dispose tensors to free memory
            intermediateOutputData.dispose();
            toVisualize.dispose();

            }else{
                layerJSON.push({
                    'layerInput': layer.input,
                    'layerOutput': layer.output,
                    'KernelSize': layer.kernelSize,
                    'activation': layer.activation,
                    'layerName': layer.name,
                    'layerIndex': index,
                    'layerType': layerType,
                    'layerConv2DIndex': layerConv2DIndex
                })
            }

        });

        console.log('Model loaded successfully');
        // console.log(layerJSON)
        return {layerJSON: layerJSON, neuronJSON: neuronJSON};

    // } catch (error) {
    //     console.error('Failed to load the model', error);
    //     return {}
    // }
};
