// https://www.tensorflow.org/js/tutorials/setup
// https://observablehq.com/@tvirot/machine-learning-in-javascript-with-tensorflow-js-part-iii
// https://www.tensorflow.org/js/guide/models_and_layers
// https://stackoverflow.com/questions/736590/add-new-attribute-element-to-json-object-using-javascript
// https://stackoverflow.com/questions/46715484/correct-async-function-export-in-node-js

import * as tf from '@tensorflow/tfjs';

export async function loadModel(){
    try {
        const model = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');

        let layerJSON = {};
        let layerConv2DIndex = 0;

        model.layers.forEach((layer, index) => {
            const layerType = layer.getClassName();
            let neuronCount = -1;

            // create new layer attribute
            if (!layerJSON[layer.name]){
                layerJSON[layer.name] = {};
            }

            if (layerType === 'Conv2D') {
                neuronCount = layer.filters;
                layerConv2DIndex += 1;
            }
            layerJSON[layer.name].layerIndex = index;
            layerJSON[layer.name].layerType = layerType;
            layerJSON[layer.name].neuronCount = neuronCount;
            layerJSON[layer.name].layerConv2DIndex = layerConv2DIndex;
        });

        console.log('Model loaded successfully');
        console.log(layerJSON)
        return layerJSON;

    } catch (error) {
        console.error('Failed to load the model', error);
        return {}
    }
};
