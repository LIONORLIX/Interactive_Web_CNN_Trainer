//https://www.shecodes.io/athena/9359-how-to-read-and-delete-json-data-in-react
//https://www.dhiwise.com/post/mastering-jsoneditor-react-for-efficient-data-manipulation

import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis'
import './App.css';
import './chart.css';

import Chart from './chart/chart.js'
import ControlBar from './UI/ControlBar'

import { MnistData } from './methods/data.js';
import { createModel } from './methods/create_model.js'
import { showAccuracy, showConfusion, train } from './methods/train_model.js';
import { showExamples, getImageTensor } from './methods/show_image_data.js'
import { test } from './methods/smallTest.js'

function App() {

  const [imageData, setImageData] = useState([]);
  const [testValue, setTestValue] = useState(0);

  const [modelConfig, setModelConfig] = useState([
    { 
      'layerType': 'Conv2D',
      'kernelSize': 5,
      'filters': 8,
      'strides': 1,
      'activation': 'relu',
      'kernelInitializer': 'varianceScaling'
    },
    { 
      'layerType': 'Conv2D',
      'kernelSize': 5,
      'filters': 16,
      'strides': 1,
      'activation': 'relu',
      'kernelInitializer': 'varianceScaling'
    },
    { 
      'layerType': 'Conv2D',
      'kernelSize': 5,
      'filters': 8,
      'strides': 1,
      'activation': 'relu',
      'kernelInitializer': 'varianceScaling'
    },
    { 
      'layerType': 'MaxPooling2D',
      'poolSize': [2, 2],
      'strides': [2, 2]
    }
  ]);



  useEffect(() => {

    // setModelConfig(modelConfig)
    // console.log("1"+modelConfig);

    (async () => {

      const data = new MnistData();
      await data.load();
      // await showExamples(data);

      // const model = createModel(modelConfig);
      // tfvis.show.modelSummary({ name: 'Model Architecture', tab: 'Model' }, model);

      // await train(model, data);

      // test(data);
      // setModelConfig(modelConfig);

    })();

    
    setTestValue(20);

  }, []);

  return (
    <div>
      <Chart 
      testValue = {testValue} 
      modelConfig = {modelConfig}
      />

    </div>
  );
}

export default App;
