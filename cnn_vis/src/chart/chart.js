//https://blog.logrocket.com/getting-started-d3-js-react/
// https://www.w3schools.com/graphics/svg_path.asp

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
      console.log(layerData);
      // console.log(neuronData);
      // console.log(neuronData[0]["tensor1D"]);

      const svgContainer = d3.select(ref.current);
      svgContainer.selectAll("*").remove(); // remove former charts to avoid drawing twice or more

      // create svg chart
      const svg = svgContainer
        .append("svg")

      const nodes = svg.append("g")

      let neuron = nodes.selectAll(".neuron")
        .data(neuronData)
        .enter()
           .append("g")
             .attr("class",function (d,i) { return "neuron_"+i })
             .attr("transform", function(d, i) {return "translate(" + (d.layerConv2DIndex * 200 + 200) + "," +  (d.neuronIndex * 50 + 50) + ")"; });
      
      let path = neuron.selectAll(".path")
             .data(function (d,i) { 
               let formerNeurons = [];
               let dual_array = [];
               let num = 0;
               for (let i=0;i<d.prevNeuronCount;i++){
                 
                 dual_array.push(num);
                 dual_array.push(d.neuronIndex);
                 formerNeurons.push(dual_array);
                 dual_array = [];
                 num += 1;

               }
               return formerNeurons;
             })
             .enter()
             .append("line")
                 .attr("class",function (d,i) { return "path" })
                 .join("line")
                 .attr("x1", 0)
                 .attr("y1", 0)
                 .attr("x2", -200)
                 .attr("y2", function(d){
                  return 50*d[0]-50*d[1]
                })
                 .attr("stroke-width", 1)
                 .attr("stroke", "gray")
                 .attr("transform", function(d, i) {return "translate(20,20)"; })
                 //  .moveTo(10, 10)
                 //   .bezierCurveTo(95, 10, 50, 90, 10, 10);

      let row = neuron.selectAll(".row")
        .data(function (d) { return d.tensor2D })
        .enter()  
           .append("g")
             .attr("class", "row")
             .attr("transform", function(d, i) { return "translate(0," + i * 2 + ")"; });
      
      let pixel = row.selectAll(".pixel")
      .data(function (d,i) { return d })
        .enter() 
        .append("rect")
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