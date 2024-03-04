//https://blog.logrocket.com/getting-started-d3-js-react/
// https://www.w3schools.com/graphics/svg_path.asp

import React, { useState, useEffect, useCallback, Component } from "react"
import * as tf from '@tensorflow/tfjs';
import * as d3 from "d3"

import { MnistData } from '../methods/data.js';
import { loadModel } from "../methods/load_model_data.js"
import { createModel } from "../methods/create_model.js"
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

      const chartOffset = 20;
      const pixelSize = 1.5;
      const neuronHorizontalDis = 60;
      const neuronVerticalDis = 150;
      const curveOffset = 50;

      console.log("This is value: " + props.testValue);

      const Data = await loadModel(createModel(props.modelConfig), inputData);

      const layerData = Data.layerJSON;
      const neuronData = Data.neuronJSON;
      const originalImage = Data.originalImage;

      console.log(originalImage)

      setLayerData(layerData);
      setneuronData(neuronData);
      console.log(layerData);
      console.log(neuronData);
      // console.log(neuronData[0]["tensor1D"]);

      const svgContainer = d3.select(ref.current);
      svgContainer.selectAll("*").remove(); // remove former charts to avoid drawing twice or more

      // create svg chart
      const svg = svgContainer
        .append("svg")
        .attr("id", "chart")
        // .attr("viewBox", "0 0 1000 1000")

      const nodes = svg.append("g")

      let connection = nodes.selectAll(".connection")
        .data(neuronData)
        .enter()
        .append("g")
        .attr("class", function (d, i) { return "connection" })
        .attr("transform", function (d, i) { 
          return "translate(" +  (d.neuronIndex * neuronHorizontalDis + chartOffset + 1 ) + "," + (d.sizeCnt * pixelSize + d.layerConv2DCnt * neuronVerticalDis + d.layerPoolingCnt * neuronVerticalDis/4 + d.layerDenseCnt * neuronVerticalDis + chartOffset ) + ")"; 
        });

      let path = connection.selectAll(".path")
        .data(function (d, i) {
          let formerNeurons = [];
          let info_array = [];
          let num = 0;
          for (let i = 0; i < d.prevNeuronCount; i++) {

            info_array.push(num);
            info_array.push(d.neuronIndex);
            info_array.push(d.layerType);

            formerNeurons.push(info_array);
            info_array = [];
            num += 1;

          }
          return formerNeurons;
        })
        .enter()
        .append("path")
        .attr("class", function (d, i) { return "path" })
        .join("path")
        .attr("d", function (d) {

          let x1, y1, x2, y2;
          if (d[2]=='Conv2D' || d[2]=='Dense'){
            y1 = -neuronVerticalDis;
            x1 = neuronHorizontalDis * d[0] - neuronHorizontalDis * d[1];
            y2 = 0;
            x2 = 0;
          }else{
            y1 = -neuronVerticalDis/4;
            x1 = 0;
            y2 = 0;
            x2 = 0;
          }
          return "M " + x1 + " " + y1 + " " 
          + "C " + (x1) + " " + (y1 + curveOffset) + "," 
          + (x2) + " " + (y2 - curveOffset) + "," 
          + x2 + " " + y2

        })
        .attr("stroke-width", 1)
        .attr("stroke", "rgb(200,200,200)")
        .attr("fill", "transparent")

      let originalNeuron = nodes
        .append("g")
        .attr("class", "origin")
        .attr("transform", 
          "translate(" + chartOffset + "," + chartOffset + ")"
        )

      let originalRow = originalNeuron.selectAll(".row")
        .data(originalImage[0])
        .enter()
        .append("g")
        .attr("class", "row")
        .attr("transform", function (d, i) { 
          // console("hhhhh")
          return "translate(0," + i * pixelSize + ")"; });

      let originalPixel = originalRow.selectAll(".pixel")
        .data(function (d, i) { return d })
        .enter()
        .append("rect")
        .attr("class", "pixel")
        .attr("x", function (d, i) {
          return i * pixelSize;
        })
        .attr("width", pixelSize)
        .attr("height", pixelSize)
        .attr("fill", function (d) { return "rgb(" + d * 255 + "," + d * 255 + "," + d * 255 + ")"; });


      let neuron = nodes.selectAll(".neuron")
        .data(neuronData)
        .enter()
        .append("g")
        .attr("class", function (d, i) { return "neuron" })
        .attr("transform", function (d, i) { 
          return "translate(" + (d.neuronIndex * neuronHorizontalDis + chartOffset) + "," + (d.sizeCnt*pixelSize + d.layerConv2DCnt * neuronVerticalDis + d.layerPoolingCnt * neuronVerticalDis/4 + d.layerDenseCnt * neuronVerticalDis + chartOffset) + ")";
        })

      let row = neuron.selectAll(".row")
        .data(function (d) { return d.tensor2D })
        .enter()
        .append("g")
        .attr("class", "row")
        .attr("transform", function (d, i) { return "translate(0," + i * pixelSize + ")"; });

      let pixel = row.selectAll(".pixel")
        .data(function (d, i) { return d })
        .enter()
        .append("rect")
        .attr("class", "pixel")
        .attr("x", function (d, i) {
          return i * pixelSize;
        })
        .attr("width", pixelSize)
        .attr("height", pixelSize)
        .attr("fill", function (d) { return "rgb(" + d * 255 + "," + d * 255 + "," + d * 255 + ")"; });


    })();
  }, [props.testValue, props.modelConfig]
  )

  return (
    <div id={'chart-container'} ref={ref}></div>
  )
}

export default Chart;