// https://www.tensorflow.org/js/tutorials/setup
// https://observablehq.com/@tvirot/machine-learning-in-javascript-with-tensorflow-js-part-iii
// https://www.tensorflow.org/js/guide/models_and_layers
// https://stackoverflow.com/questions/736590/add-new-attribute-element-to-json-object-using-javascript
// https://stackoverflow.com/questions/46715484/correct-async-function-export-in-node-js
// https://stackoverflow.com/questions/50942677/tensorflowjs-how-to-get-inner-layer-output-in-a-cnn-prediction

import * as tf from '@tensorflow/tfjs';

export async function loadModel(model,imageData){

    console.log(imageData)

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
        //     const intermediateLayerName = layer.name;
        //     const intermediateLayerModel = tf.model({
        //         inputs: model.input,
        //         outputs: model.getLayer(intermediateLayerName).output
        //     });
        //     const intermediateOutputData = intermediateLayerModel.predict(imageData);
        //     console.log(intermediateOutputData);
        //     const toVisualize = intermediateOutputData.squeeze().slice([0, 0, 0], [-1, -1, 1])squeeze();
        // // Visualize on canvas
        // const canvas = document.getElementById('canvas');
        // tf.browser.toPixels(toVisualize, canvas);
        // // Dispose tensors to free memory
        // intermediateOutputData.dispose();
        // toVisualize.dispose();
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
};
