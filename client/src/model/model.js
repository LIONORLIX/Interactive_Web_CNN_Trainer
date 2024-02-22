// https://www.tensorflow.org/js/tutorials/setup
import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import fs from 'fs';

function Model(props) {

  const [layers, setLayers] = useState([]);

  useEffect(() => {
    const loadModel = async () => {
        const model = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
        const layerDetails = model.layers.map(layer => {
            const layerType = layer.getClassName();
            let neuronCount = '';
            if (layerType === 'Dense') {
                neuronCount = layer.units;
            } else if (layerType === 'Conv2D') {
                neuronCount = layer.filters;
            }
            return { name: layer.name, type: layerType, neuronCount: neuronCount };
        });
        setLayers(layerDetails);
    };

    // fs.readFile('./myFile.json', 'utf8', (err, jsonString) => {
    //     if (err) {
    //         return;
    //     }
    //     try {
    //         const customer = JSON.parse(jsonString);
    // } catch(err) {
    //         console.log('Error parsing JSON string:', err);
    //     }
    // })

    // const updatedJSON = {
    //     "name":"arif updated",
    //     "surname":"shariati updated"
    // }

    // fs.writeFile('./myFile.json', JSON.stringify(updatedJSON), (err) => {
    //     if (err) console.log('Error writing file:', err);
    // })

    loadModel();
}, []);
  
    return (
      <div>
            <h1>Model Layers</h1>
            <div>
                {layers.map((layer, index) => (
                    <p key={index}>
                        Layer Name: {layer.name}, Layer Type: {layer.type}
                        {layer.neuronCount ? `, Neuron Count: ${layer.neuronCount}` : ''}
                    </p>
                ))}
            </div>
        </div>
  );
}

export default Model;
