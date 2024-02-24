//https://www.shecodes.io/athena/9359-how-to-read-and-delete-json-data-in-react
//https://www.dhiwise.com/post/mastering-jsoneditor-react-for-efficient-data-manipulation

import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis'
import './App.css';
import './chart.css';

import Chart from './chart/chart.js'
import Monitor from "./methods/monitor.js"
import {MnistData} from './methods/data.js';
import { showExamples, getModel, train, showAccuracy, showConfusion, run } from './methods/script.js';

function App() {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    
    (async ()=>{
      console.log('2');
      const data = new MnistData();
      console.log('hi');
      await data.load();
      await showExamples(data);
      const model = getModel();
      tfvis.show.modelSummary({name: 'Model Architecture', tab: 'Model'}, model);
  
      await train(model, data);

      await showAccuracy(model, data);
      await showConfusion(model, data);
    
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
