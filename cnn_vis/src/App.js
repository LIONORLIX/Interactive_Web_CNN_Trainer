//https://www.shecodes.io/athena/9359-how-to-read-and-delete-json-data-in-react
//https://www.dhiwise.com/post/mastering-jsoneditor-react-for-efficient-data-manipulation

import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis'
import './App.css';
import './chart.css';

import Chart from './chart/chart.js'
import {MnistData} from './methods/data.js';
import {getModel} from './methods/create_model.js'
import { showExamples, showAccuracy, showConfusion, train } from './methods/monitor.js';

function App() {
  // const [items, setItems] = useState([]);
  // const [newItemName, setNewItemName] = useState("");
  // const [message, setMessage] = useState("");

  useEffect(() => {
    
    (async ()=>{

      const data = new MnistData();

      await data.load();
      await showExamples(data);
      const model = getModel();
      tfvis.show.modelSummary({name: 'Model Architecture', tab: 'Model'}, model);
  
      await train(model, data);

      // await showAccuracy(model, data);
      // await showConfusion(model, data);
    
    })();
  
  }, []);

  return (
    <div>
      <Chart/>
      {/* <Monitor/> */}
    </div>
  );
}

export default App;
