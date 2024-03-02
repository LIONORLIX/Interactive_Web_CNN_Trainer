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

      const chartOffset = 20;
      const pixelSize = 1.5;
      const neuronVerticalDis = 50;
      const neuronHorizontalDis = 200;
      const curveOffset = 80;

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

      let connection = nodes.selectAll(".connection")
        .data(neuronData)
        .enter()
        .append("g")
        .attr("class", function (d, i) { return "connection" })
        .attr("transform", function (d, i) { return "translate(" + (d.layerConv2DIndex * neuronHorizontalDis + neuronHorizontalDis +chartOffset) + "," + (d.neuronIndex * neuronVerticalDis + chartOffset) + ")"; });

      let path = connection.selectAll(".path")
        .data(function (d, i) {
          let formerNeurons = [];
          let dual_array = [];
          let num = 0;
          for (let i = 0; i < d.prevNeuronCount; i++) {

            dual_array.push(num);
            dual_array.push(d.neuronIndex);
            formerNeurons.push(dual_array);
            dual_array = [];
            num += 1;

          }
          return formerNeurons;
        })
        .enter()
        .append("path")
        .attr("class", function (d, i) { return "path" })
        .join("path")
        .attr("d", function (d) {
          let x1 = -neuronHorizontalDis;
          let y1 = neuronVerticalDis * d[0] - neuronVerticalDis * d[1];
          let x2 = 0;
          let y2 = 0;
          return "M " + x1 + " " + y1 + " " + "C " + (x1 + curveOffset) + " " + y1 + "," + (x2 - curveOffset) + " " + y2 + "," + x2 + " " + y2
        })
        .attr("stroke-width", 1)
        .attr("stroke", "gray")
        .attr("fill", "transparent")

      let neuron = nodes.selectAll(".neuron")
        .data(neuronData)
        .enter()
        .append("g")
        .attr("class", function (d, i) { return "neuron_" + i })
        .attr("transform", function (d, i) { return "translate(" + (d.layerConv2DIndex * neuronHorizontalDis + neuronHorizontalDis + chartOffset) + "," + (d.neuronIndex * neuronVerticalDis + chartOffset) + ")"; })


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
  }, [props.testValue]
  )

  return (
    <div id={'main'} ref={ref}></div>
  )
}

export default Chart;