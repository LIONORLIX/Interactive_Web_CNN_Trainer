//https://blog.logrocket.com/getting-started-d3-js-react/
// https://www.w3schools.com/graphics/svg_path.asp

import React, { useState, useEffect, useCallback, Component } from "react"
import * as tf from '@tensorflow/tfjs';
import * as d3 from "d3"

import { MnistData } from '../methods/data.js';

import { createModel } from "../methods/create_model.js"
import { showExamples, getImageTensor } from '../methods/show_image_data.js'

function Chart(props) {

  const ref = React.useRef(null) // Use React ref to control DOM elements for D3
  // const [layers, setLayers] = useState([]);

  useEffect(() => {
    (async () => {

      console.log("CHART start rendering.");
    
      const chartOffset = 40;
      const pixelSize = 1.5;
      const neuronHorizontalDis = 70;
      const neuronVerticalDis = 220;
      const curveOffset = 100;

      console.log("This is value: " + props.testValue);

      const layerData = props.modelInfo.layerJSON;
      const neuronData = props.modelInfo.neuronJSON;
      const originalImage = props.modelInfo.originalImage;

      console.log(originalImage)

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

      // draw all the connection lines
      let connection = nodes.selectAll(".connection")
        .data(neuronData)
        .enter()
        .append("g")
        .attr("className", function (d, i) { return "connection" })
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
        .attr("className", function (d, i) { return "path" })
        .attr("id", function (d, i){
          if (d[2]=='Conv2D'){
            return 'Conv2D'+i
          }else if(d[2]=='Dense'){ 
            return 'Dense'+i
          }else if(d[2]=='MaxPooling2D'){
            return 'MaxPooling2D'+i
          }
          }
        )
        .join("path")
        .attr("d", function (d,i) {

          let x1, y1, x2, y2;
          if (d[2]=='Conv2D' || d[2]=='Dense'){
            y1 = -neuronVerticalDis;
            x1 = neuronHorizontalDis * d[0] - neuronHorizontalDis * d[1];
            y2 = 0;
            x2 = 0;
            return "M " + x1 + " " + y1 + " " 
          + "C " + (x1) + " " + (y1 + curveOffset) + "," 
          + (x2) + " " + (y2 - curveOffset) + "," 
          + x2 + " " + y2
          }else{
            if (i==0){
              y1 = -neuronVerticalDis/4;
              x1 = 0;
              y2 = 0;
              x2 = 0;
              return "M " + x1 + " " + y1 + " " 
          + "C " + (x1) + " " + (y1 + curveOffset) + "," 
          + (x2) + " " + (y2 - curveOffset) + "," 
          + x2 + " " + y2
            } 
          }
        })
        .attr("stroke-width", 0.4)
        .attr("stroke", "rgb(122,122,122)")
        .attr("fill", "transparent")

      // draw the first input neuron
      let originalNeuron = nodes
        .append("g")
        .attr("className", "origin")
        .attr("transform", 
          "translate(" + chartOffset + "," + chartOffset + ")"
        )
      
      let originalNeuronPoint = originalNeuron
      .append("circle")
      .attr("className", "circle")
      .attr('r','5px')
      .attr("cx", 0)
      .attr("cy", 28*pixelSize)
      .attr("fill", "white")

      let originalNeuronOutline = originalNeuron
      .append("rect")
      .attr("className", "rect")
      .attr("width",function(d){return 28*pixelSize+2})
      .attr("height",function(d){return 28*pixelSize+2})
      .attr("x", -1)
      .attr("y", -1)
      .attr("fill", "white")

      let originalRow = originalNeuron.selectAll(".row")
        .data(originalImage[0])
        .enter()
        .append("g")
        .attr("className", "row")
        .attr("transform", function (d, i) { 
          // console("hhhhh")
          return "translate(0," + i * pixelSize + ")"; });
        

      let originalPixel = originalRow.selectAll(".pixel")
        .data(function (d, i) { return d })
        .enter()
        .append("rect")
        .attr("className", "pixel")
        .attr("x", function (d, i) {
          return i * pixelSize;
        })
        .attr("width", pixelSize)
        .attr("height", pixelSize)
        .attr("fill", function (d) { return "rgb(" + d * 255 + "," + d * 255 + "," + d * 255 + ")"; });

      // draw all the neurons in each layer

      let neuron = nodes.selectAll(".neuron")
        .data(neuronData)
        .enter()
        .append("g")
        .attr("className", "neuron")
        .attr("id", function (d, i) { return "neuron" + i })
        .attr("transform", function (d, i) { 
          return "translate(" + (d.neuronIndex * neuronHorizontalDis + chartOffset) + "," + (d.sizeCnt * pixelSize + d.layerConv2DCnt * neuronVerticalDis + d.layerPoolingCnt * neuronVerticalDis/4 + d.layerDenseCnt * neuronVerticalDis + chartOffset) + ")";
        })

      let neuronPointUp = neuron
      .append("circle")
      .attr("className", "circle")
      .attr('r','5px')
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("fill", "white")

      let neuronPointDown = neuron
      .append("circle")
      .attr("className", "circle")
      .attr('r','4px')
      .attr("cx", 0)
      .attr("cy", function(d){return d.tensor2D.length*pixelSize})
      .attr("fill", "white")

      let neuronPointOutline = neuron
      .append("rect")
      .attr("className", "rect")
      .attr("width",function(d){return d.tensor2D.length*pixelSize+2})
      .attr("height",function(d){return d.tensor2D.length*pixelSize+2})
      .attr("x", -1)
      .attr("y", -1)
      .attr("fill", "white")

      let row = neuron.selectAll(".row")
        .data(function (d) { return d.tensor2D })
        .enter()
        .append("g")
        .attr("className", "row")
        .attr("transform", function (d, i) { return "translate(0," + i * pixelSize + ")"; });

      let pixel = row.selectAll(".pixel")
        .data(function (d, i) { return d })
        .enter()
        .append("rect")
        .attr("className", "pixel")
        .attr("x", function (d, i) {
          return i * pixelSize;
        })
        .attr("width", pixelSize)
        .attr("height", pixelSize)
        .attr("fill", function (d) { return "rgb(" + d * 255 + "," + d * 255 + "," + d * 255 + ")"; });

        console.log("CHART rendered.");


    })();
  }, [props.modelInfo]
  )

  return (
    <div className={'chart-container'} ref={ref}></div>
  )
}

export default Chart;