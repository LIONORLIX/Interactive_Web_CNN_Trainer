// Author: Xiang Li
// UAL Student ID: 23009641
//
// Create Main Web App
//
// Reference:
// https://www.shecodes.io/athena/9359-how-to-read-and-delete-json-data-in-react
// https://www.dhiwise.com/post/mastering-jsoneditor-react-for-efficient-data-manipulation
// https://react.dev/learn/managing-state
// https://legacy.reactjs.org/docs/hooks-effect.html

import React, { useState, useEffect } from 'react';

// import CSS
import './App.css';
import './custom_style/visualization.css';
import './custom_style/user_interface.css';

// import visulization Component
import CnnVis from './visualization/cnn_vis.js'
import Prediction from './visualization/prediction.js'

// import UI Component
import ControlBar from './user_interface/control_bar.js'
import ChangeImage from './user_interface/change_image.js'

// import ML Component
import { MnistData } from './machine_learning/data.js';
import { createModel } from './machine_learning/create_model.js'
import { loadModelData } from "./machine_learning/load_model_data.js"
import { train } from './machine_learning/train_model.js';
import { getImageTensor } from './machine_learning/show_image_data.js'

function App() {

  // initialize all the React state for rerendering when data changes or user sets any input

  // state for set up training dataset
  const [data, setData] = useState(null);
  const [inputData, setInputData] = useState(null);

  // state for check training
  const [isTraining, setIsTraining] = useState(false);
  const [isTrainingDone, setIsTrainingDone] = useState(false);
  const [trainingLogs, setTrainingLogs] = useState([]);
  const [epoch, setEpoch] = useState(-1);
  const [epochCount, setEpochCount] = useState(10);

  // state for config model and pass model info to UI and vis charts
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
  const [modelInfo, setModelInfo] = useState(null);

  // some other state state for UI control
  const [isChangeImage, setIsChangeImage] = useState(false);

  // useEffect will trigger code inside and rerender relevent components when state in dependency array changes

  // This part get the dataset
  useEffect(() => {

    (async () => {
      console.log("APP part0 start rendering.");

      const newData = new MnistData();
      await newData.load();
      setData(newData);
      if (data) {
        const newInputData = await getImageTensor(data);
        setInputData(newInputData)
      }
      console.log("APP part0 rendered.");

    })();

  }, []);

  // This part pick one image in the dataset for visulization
  useEffect(() => {

    (async () => {
      console.log("APP part0 start rendering.");

      if (data) {
        const newInputData = await getImageTensor(data);
        setInputData(newInputData)
      }
      console.log("APP part0 rendered.");

    })();

  }, [data, isChangeImage]);

  // This part set and train the model
  useEffect(() => {

    (async () => {
      if (data) { // when MNIST data imported
        console.log("APP part1 start rendering.");

        if (!isTraining) { // when is not training
          let newModel = createModel(modelConfig) // create new model based on configuration
          setModel(newModel); // update new model
        } else if (isTraining && !isTrainingDone){ // when is training
          // train the model
          await train(model, data, setEpoch, setIsTraining, setIsTrainingDone, setTrainingLogs, trainingLogs, epochCount);
        }
        console.log("APP part1 rendered.");
      }

    })();

  }, [modelConfig, isTraining, data]);

  // This part get the data of model and pass to the visulization chart
  useEffect(() => {

    (async () => {
      if (data && inputData) { // when MNIST data imported and sample picked
        console.log("APP part2 start rendering.");

        if (model) { // when model updated

          // get model info for visualization
          const newModelInfo = await loadModelData(model, inputData);
          setModelInfo(newModelInfo);
          console.log(modelConfig)
        }

        console.log("APP part2 rendered.");
      }

    })();

  }, [model, isTrainingDone, data, inputData]);

  // This is a function to change training state
  function trainingToggle() {
    if (isTraining) {
      let newIsTrainingDone = false;
      setIsTrainingDone(newIsTrainingDone)
      setTrainingLogs([])
    }
    let newTraining = !isTraining;

    setIsTraining(newTraining)
    console.log('isTraining: ' + newTraining)
  }

  // render all the interface and visualization
  return (
    <div>

      {/* visualization */}
      {modelInfo && (
        <CnnVis
          modelInfo={modelInfo}
          epoch={epoch}
        />
      )}
      {modelInfo && (
        <Prediction
          modelInfo={modelInfo}
          epoch={epoch}
          isChangeImage={isChangeImage}
        />
      )}

      {/* user interface */}
      <ControlBar
        modelConfig={modelConfig}
        setModelConfig={setModelConfig}
        trainingToggle={trainingToggle}
        isTraining={isTraining}
        isTrainingDone={isTrainingDone}
        trainingLogs={trainingLogs}
        epoch={epoch}
        epochCount={epochCount}
        setEpochCount={setEpochCount}
      />
      <ChangeImage
        isChangeImage={isChangeImage}
        setIsChangeImage={setIsChangeImage}
      />
    </div>
  );
}

export default App;
