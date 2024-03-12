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
import './ui.css';

import Chart from './chart/chart.js'

import ControlBar from './UI/ControlBar'
import ChangeImage from './UI/ChangeImage'

import { MnistData } from './methods/data.js';
import { createModel } from './methods/create_model.js'
import { loadModelData } from "./methods/load_model_data.js"
import { showAccuracy, showConfusion, train } from './methods/train_model.js';
import { showExamples, getImageTensor } from './methods/show_image_data.js'
import { test } from './methods/smallTest.js'

function App() {

  const [data, setData] = useState(null);
  const [inputData, setInputData] = useState(null);

  const [isTraining, setIsTraining] = useState(false);
  const [isTrainingDone, setIsTrainingDone] = useState(false);
  const [trainingLogs, setTrainingLogs] = useState([]);

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
  }
  ]);

  const [model, setModel] = useState(null);

  const [epoch, setEpoch] = useState(-1);

  const [modelInfo, setModelInfo] = useState(null);

  const [isChangeImage, setIsChangeImage] = useState(false);


  useEffect(() => {

    (async () => {
      console.log("APP part0 start rendering.");

      const newData = new MnistData();
      await newData.load();
      setData(newData);
      if (data){
        const newInputData = await getImageTensor(data);
        setInputData(newInputData)
      }
      console.log("APP part0 rendered.");

    })();

  }, []);

  useEffect(() => {

    (async () => {
      console.log("APP part0 start rendering.");

      if (data){
        const newInputData = await getImageTensor(data);
        setInputData(newInputData)
      }
      console.log("APP part0 rendered.");

    })();

  }, [data, isChangeImage]);

  // This part set and train the model
  useEffect(() => {

    (async () => {
      if (data) {
      console.log("APP part1 start rendering.");

      if (!isTraining) {
        let newModel = createModel(modelConfig)
        setModel(newModel);
      } else {
        await train(model, data, setEpoch, setIsTraining, setIsTrainingDone, setTrainingLogs, trainingLogs);
      }
      console.log("APP part1 rendered.");
    }

    })();

  }, [modelConfig, isTraining, data]);

  // This part get the data of model and pass to the CHART

  useEffect(() => {

    (async () => {
      if (data && inputData) {
      console.log("APP part2 start rendering.");

      if (model) {
        const newModelInfo = await loadModelData(model, inputData);
        setModelInfo(newModelInfo);
        console.log(modelConfig)
      }

      console.log("APP part2 rendered.");
    }

    })();

  }, [model, isTrainingDone, data, inputData]);

  function trainingToggle() {
    let newTraining = !isTraining;
    setIsTraining(newTraining)
    console.log('isTraining: ' + newTraining)
  }

  return (
    <div>
      {modelInfo && (
        <Chart
          modelInfo={modelInfo}
          epoch={epoch}
        />
      )}
      <ControlBar
        modelConfig={modelConfig}
        setModelConfig={setModelConfig}
        trainingToggle={trainingToggle}
        isTraining={isTraining}
        isTrainingDone={isTrainingDone}
        trainingLogs={trainingLogs}
        epoch={epoch}
      />
      <ChangeImage
        isChangeImage = {isChangeImage}
        setIsChangeImage = {setIsChangeImage}
      />
    </div>
  );
}

export default App;
