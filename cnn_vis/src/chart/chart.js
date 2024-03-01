//https://blog.logrocket.com/getting-started-d3-js-react/

import React, { useState, useEffect, useCallback, Component } from "react"
import * as tf from '@tensorflow/tfjs';
import * as d3 from "d3"

import { MnistData } from '../methods/data.js';
import { loadModel } from "../methods/load_model_data.js"
import { getModel } from "../methods/create_model.js"
import { showExamples, getImageTensor } from '../methods/show_image_data.js'

function Chart(props) {

  const ref = React.useRef(null) // Use React ref to control DOM elements for D3
  // const [layers, setLayers] = useState([]);
  const [layerData, setLayerData] = useState([]);
  const [neuronData, setneuronData] = useState([]);

  useEffect(() => {
    (async () => {

      const data = new MnistData();
      await data.load();
      const inputData = await getImageTensor(data); // Creates a tensor of ones

      console.log("This is value: " + props.testValue);

      const Data = await loadModel(getModel(), inputData);
      const layerData = Data.layerJSON;
      const neuronData = Data.neuronJSON;
      setLayerData(layerData);
      setneuronData(neuronData);
      // console.log(layerData);
      // console.log(neuronData);
      // console.log(neuronData[0]["tensor1D"]);

      const svgContainer = d3.select(ref.current);
      svgContainer.selectAll("*").remove(); // remove former charts to avoid drawing twice or more

      // create svg chart
      const svg = svgContainer
        .append("svg")

      const nodes = svg.append("g")

//       var margin = {top: 5, right: 5, bottom: 5, left: 5},
//     width = 50 - margin.left - margin.right,
//     height = 50 - margin.top - margin.bottom;

//       var x = d3.scaleLinear()
//     .range([0, width])
//     .domain([0,neuronData[0].tensor2D.length]);

// var y = d3.scaleLinear()
//     .range([0, height])
//     .domain([0,neuronData[0].tensor2D.length]);

var rowCnt = 0;
var clnCnt = 0;

    var colorLow = 'green', colorMed = 'yellow', colorHigh = 'red';

var colorScale = d3.scaleLinear()
     .domain([0, 1])
     .range([colorLow, colorHigh]);

      // nodes.selectAll("circle")
      //   .data(neuronData)
      //   .enter()
      //   .append("circle")
      //   .attr("r", 5)
      //   .attr("cx", function (d) {
      //     return d.layerConv2DIndex * 30 + 100
      //   })
      //   .attr("cy", function (d) {
      //     return d.neuronIndex * 15 + 100
      //   })
      //   .attr("fill", "#000")

      let neuron = nodes.selectAll(".neuron")
        .data(neuronData)
        .enter()
           .append("g")
             .attr("class",function (d,i) { return "neuron_"+i })
             .attr("transform", function(d, i) {return "translate(" + (d.layerConv2DIndex * 100 + 40) + "," +  (d.neuronIndex * 50 + 20) + ")"; });
            //  .attr("x", function (d) {
            //   return d.layerConv2DIndex * 30 + 100
            // })
            // .attr("y", function (d) {
            //   return d.neuronIndex * 15 + 100
            // })

      let row = neuron.selectAll(".row")
        .data(function (d) { return d.tensor2D })
        .enter()  
           .append("g")
             .attr("class", "row")
             .attr("transform", function(d, i) { return "translate(0," + i * 2 + ")"; });
      
      let pixel = row.selectAll(".pixel")
      .data(function (d,i) { return d })
        .enter() 
        .append("rect") // 这里以矩形为例
        .attr("class", "pixel")
             .attr("x", function(d, i) { 
              return i*2; 
            })
             .attr("width", 2)
             .attr("height", 2)
             .attr("fill", function(d) { return "rgb("+ d*255 + ","+ d*255 + ","+ d*255 + ")"; });


    })();
  }, [props.testValue]
  )

  return (
    <div id={'main'} ref={ref}></div>
  )
}

export default Chart;