//https://www.shecodes.io/athena/9359-how-to-read-and-delete-json-data-in-react
//https://www.dhiwise.com/post/mastering-jsoneditor-react-for-efficient-data-manipulation
// https://react.dev/learn/managing-state
// https://legacy.reactjs.org/docs/hooks-effect.html

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
import { loadModelData } from "./methods/load_model_data.js"
import { showAccuracy, showConfusion, train } from './methods/train_model.js';
import { showExamples, getImageTensor } from './methods/show_image_data.js'
import { test } from './methods/smallTest.js'

function App() {

  const [imageData, setImageData] = useState([]);
  
  const [isTraining, setIsTraining] = useState(false); 

  const [modelConfig, setModelConfig] = useState([{
    'layerType': 'Conv2D',
    'kernelSize': 5,
    'filters': 8,
    'strides': 1,
    'activation': 'relu',
    'kernelInitializer': 'varianceScaling',
    'isMaxPooling': false
  },
  {
    'layerType': 'Conv2D',
    'kernelSize': 5,
    'filters': 16,
    'strides': 1,
    'activation': 'relu',
    'kernelInitializer': 'varianceScaling',
    'isMaxPooling': false
  },
  {
    'layerType': 'Conv2D',
    'kernelSize': 5,
    'filters': 8,
    'strides': 1,
    'activation': 'relu',
    'kernelInitializer': 'varianceScaling',
    'isMaxPooling': true
  },
  // {
  //   'layerType': 'MaxPooling2D',
  //   'poolSize': [2, 2],
  //   'strides': [2, 2]
  // }
  ]);

  const [model, setModel] = useState(null);

  const [epoch, setEpoch] = useState(-1);

  const [modelInfo, setModelInfo] = useState(null);

  // const updateModel = (updatedModel)=>{
  //   console.log("haha")
  //   setModel(updatedModel)
  // }

  // setModelConfig(model);

  useEffect(() => {

    (async () => {

      console.log("APP part1 start rendering.");

      const data = new MnistData();
      await data.load();
      
      if (!isTraining){
        let newModel = createModel(modelConfig)
        setModel(newModel);
      }else{
        await train(model, data, setEpoch);
      }

      // await showExamples(data);
      // tfvis.show.modelSummary({ name: 'Model Architecture', tab: 'Model' }, model);
      // await train(model, data);
      // test(data);
      
      console.log("APP part1 rendered.");

    })();

  }, [modelConfig, isTraining]);

  useEffect(() => {

    (async () => {

      console.log("APP part2 start rendering.");

      const data = new MnistData();
      await data.load();

      if (model) {
        const inputData = await getImageTensor(data); // Creates a tensor of ones
        const newModelInfo = await loadModelData(model, inputData);
        setModelInfo(newModelInfo);
        console.log(modelConfig)
      }

      console.log("APP part2 rendered.");

    })();

  }, [model, epoch]);

  function trainingToggle(){
    let newTraining = !isTraining;
    setIsTraining(newTraining)
    console.log('isTraining: '+ newTraining)
  }

  return (
    <div>
      {modelInfo && (
        <Chart
          modelInfo={modelInfo}
          // modelConfig = {modelConfig}
        />
      )}
      <ControlBar
        modelConfig = {modelConfig}
        setModelConfig = {setModelConfig}
        trainingToggle = {trainingToggle}
        isTraining = {isTraining}
      />
    </div>
  );
}

export default App;
