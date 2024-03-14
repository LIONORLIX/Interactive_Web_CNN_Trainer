// Author: Xiang Li
// UAL Student ID: 23009641
// Reference:
// https://blog.logrocket.com/getting-started-d3-js-react/
// https://www.w3schools.com/graphics/svg_path.asp
// https://medium.com/analytics-vidhya/how-and-why-to-add-a-chart-to-your-d3-js-tooltip-6aca4ecfd79d
// https://snyk.io/advisor/npm-package/d3/functions/d3.mouse
// https://d3js.org/d3-selection/events

import React, { useState, useEffect, useCallback, Component } from "react"
// import d3.js for visulization
import * as d3 from "d3"
import d3Tip from "d3-tip"

// This function draw the main CNN visualization part
function CnnVis(props) {
  // use React ref to control DOM elements for D3
  const ref = React.useRef(null) 

  useEffect(() => {
    (async () => {

      console.log("CNN_VIS start rendering.");

      // set a series of parameters for drawing chart
      const chartOffset = 40;
      const pixelSize = 1.5;
      const neuronHorizontalDis = 70;
      const neuronVerticalDis = 220;
      const curveOffset = 100;
      const initialNeuronSize = 8;

      // get model data
      const layerData = props.modelInfo.layerJSON;
      const neuronData = props.modelInfo.neuronJSON;
      const originalImage = props.modelInfo.originalImage;

      console.log(originalImage)
      console.log(layerData);
      console.log(neuronData);

      // remove former charts to avoid drawing twice or more when rerender
      const svgContainer = d3.select(ref.current);
      svgContainer.selectAll("*").remove(); 

      // create svg canvas
      const svg = svgContainer
        .append("svg")
        .attr("id", "chart")
        .attr("height", (neuronVerticalDis + pixelSize * 28) * (layerData.length - 1) + chartOffset + 10)
        .attr("width", 70 * (16) + chartOffset)

      // create chart
      const nodes = svg.append("g")

      // create d3-tip to show neuron details
      const neuronTip = d3Tip()
        .attr('class', 'd3-tip')
        .offset(function (d, neuronData) {
          // set d3-tip position
          const [x, y] = d3.pointer(window.event, nodes);
          let direction = -1;
          if (x < window.innerWidth / 2) {
            direction = 1;
          } else {
            direction = -1;
          }
          return [15 * (neuronData.tensor2D.length + 8), direction * 15 * neuronData.tensor2D.length]
        })
        .html(function (d, neuronData) {
          let htmlContent = "<div class='tip'>"

          // show neuron title
          htmlContent += "<div class='tip-title'>"
          htmlContent += neuronData.layerName + " - #" + neuronData.neuronIndex
          htmlContent += "</div>"

          // draw 2D tensor with detailed value
          htmlContent += "<div class='tip-windows'>"
          for (let i = 0; i < neuronData.tensor2D.length; i++) {
            htmlContent += "<div class='tip-row'>"

            // the div can't contain number like "0,0003445...", so I did some calculation
            for (let j = 0; j < neuronData.tensor2D.length; j++) {
              // in order to make the tensor more readable, I set five different class to send different color to value of different ranges
              if (neuronData.tensor2D[i][j] == 0.0) {
                htmlContent += "<div class='tip-pixel zero'>"
                htmlContent += 0
              } else if (neuronData.tensor2D[i][j] * 1000 <= 200.0) {
                htmlContent += "<div class='tip-pixel one'>"
                htmlContent += (neuronData.tensor2D[i][j] * 1000).toFixed(0)
              } else if (neuronData.tensor2D[i][j] * 1000 <= 400.0) {
                htmlContent += "<div class='tip-pixel two'>"
                htmlContent += (neuronData.tensor2D[i][j] * 1000).toFixed(0)
              } else if (neuronData.tensor2D[i][j] * 1000 <= 600.0) {
                htmlContent += "<div class='tip-pixel three'>"
                htmlContent += (neuronData.tensor2D[i][j] * 1000).toFixed(0)
              } else if (neuronData.tensor2D[i][j] * 1000 <= 800.0) {
                htmlContent += "<div class='tip-pixel four'>"
                htmlContent += (neuronData.tensor2D[i][j] * 1000).toFixed(0)
              } else {
                htmlContent += "<div class='tip-pixel' five>"
                htmlContent += (neuronData.tensor2D[i][j] * 1000).toFixed(0)
              }
              htmlContent += "</div>"
            }
            htmlContent += "</div>"
          }
          htmlContent += "</div>"

          // show activation info
          htmlContent += "<div class='tip-info'>"
          if (neuronData.activation != undefined) {
            htmlContent += "<div class='tip-line'>"
            htmlContent += "Activation - " + neuronData.activation.constructor.className
            htmlContent += "</div>"
          }

          // show neuron bias
          if (neuronData.bias != undefined) {
            htmlContent += "<div class='tip-line'>"
            htmlContent += "Bia - " + neuronData.bias[neuronData.neuronIndex]
            htmlContent += "</div>"
          }
          htmlContent += "</div>"

          htmlContent += "</div>"

          return htmlContent
        })

      nodes.call(neuronTip);

      // create d3-tip to show imput image details
      const originalNeuronTip = d3Tip()
        .attr('class', 'd3-tip')
        .offset(function (d, neuronData) {
          return [15 * (28 + 7), 15 * 28]
        })
        .html(function () {

          // show input image title
          let htmlContent = "<div class='tip'>"
          htmlContent += "<div class='tip-title'>"
          htmlContent += "Input Image"
          htmlContent += "</div>"
          htmlContent += "<div class='tip-windows'>"

          // draw 2D tensor with detailed value
          for (let i = 0; i < originalImage[0].length; i++) {
            htmlContent += "<div class='tip-row'>"
            for (let j = 0; j < originalImage[0].length; j++) {
              if (originalImage[0][i][j] == 0.0) {
                htmlContent += "<div class='tip-pixel zero'>"
                htmlContent += 0
              } else if (originalImage[0][i][j] * 1000 <= 200.0) {
                htmlContent += "<div class='tip-pixel one'>"
                htmlContent += (originalImage[0][i][j] * 1000).toFixed(0)
              } else if (originalImage[0][i][j] * 1000 <= 400.0) {
                htmlContent += "<div class='tip-pixel two'>"
                htmlContent += (originalImage[0][i][j] * 1000).toFixed(0)
              } else if (originalImage[0][i][j] * 1000 <= 600.0) {
                htmlContent += "<div class='tip-pixel three'>"
                htmlContent += (originalImage[0][i][j] * 1000).toFixed(0)
              } else if (originalImage[0][i][j] * 1000 <= 800.0) {
                htmlContent += "<div class='tip-pixel four'>"
                htmlContent += (originalImage[0][i][j] * 1000).toFixed(0)
              } else {
                htmlContent += "<div class='tip-pixel' five>"
                htmlContent += (originalImage[0][i][j] * 1000).toFixed(0)
              }
              htmlContent += "</div>"
            }
            htmlContent += "</div>"
          }
          htmlContent += "</div>"
          htmlContent += "</div>"

          return htmlContent
        })

      nodes.call(originalNeuronTip);

      // create d3-tip to show filter details
      const weightTip = d3Tip()
        .attr('class', 'd3-tip')
        .offset(function (d, neuronData) {
          if (neuronData[3]) {
            const [x, y] = d3.pointer(window.event, nodes);
            let direction = -1;
            if (x < window.innerWidth / 2) {
              direction = 1;
            } else {
              direction = -1;
            }
            return [15 * (neuronData[3].length + 8), direction * 15 * neuronData[3].length]
          } else {
            return [0, 0]
          }
        })
        .html(function (d, neuronData) {
          if (neuronData[3]) {
            // show kernel title
            let htmlContent = "<div class='tip'>"
            htmlContent += "<div class='tip-title'>"
            htmlContent += "Conv2D Kernel (Filter)"
            htmlContent += "</div>"

            // draw 2D tensor of conv kernel with detailed value
            htmlContent += "<div class='tip-windows'>"
            for (let i = 0; i < neuronData[3].length; i++) {
              htmlContent += "<div class='tip-row kernel-row'>"
              for (let j = 0; j < neuronData[3].length; j++) {
                htmlContent += "<div class='tip-pixel five kernel-pixel'>"
                htmlContent += (neuronData[3][i][j][neuronData[0]][neuronData[1]] * 1000.0).toFixed(0)
                htmlContent += "</div>"
              }
              htmlContent += "</div>"
            }
            htmlContent += "</div>"
            return htmlContent
          } else {
            return null
          }
        })

      nodes.call(weightTip);


      // draw all the connection lines between neurons
      let connection = nodes.selectAll(".connection")
        .data(neuronData)
        .enter()
        .append("g")
        .attr("className", function (d, i) { return "connection" })
        .attr("transform", function (d, i) {
          return "translate(" + (d.neuronIndex * neuronHorizontalDis + chartOffset + 1) + "," + (d.sizeCnt * pixelSize + d.layerConv2DCnt * neuronVerticalDis + d.layerPoolingCnt * neuronVerticalDis / 4 + d.layerDenseCnt * neuronVerticalDis + chartOffset) + ")";
        });

      let path = connection.selectAll(".path")
        .data(function (d, i) {
          let formerNeurons = [];
          let info_array = [];
          let num = 0;
          for (let i = 0; i < d.prevNeuronCount; i++) {
            // each neruron has to connect all the neurons in the former layer, while current data doesn't have such info, I reconstruct a array to store all these info and then pass them to draw path of each neuron
            info_array.push(num); // index of former layers neuron
            info_array.push(d.neuronIndex); // index of current neuron 
            info_array.push(d.layerType);
            info_array.push(d.weights);

            formerNeurons.push(info_array);
            info_array = [];
            num += 1;

          }
          return formerNeurons;
        })
        .enter()
        .append("path")
        .attr("className", function (d, i) { return "path" })
        .attr("id", function (d, i) {
          if (d[2] == 'Conv2D') {
            return 'Conv2D' + i
          } else if (d[2] == 'Dense') {
            return 'Dense' + i
          } else if (d[2] == 'MaxPooling2D') {
            return 'MaxPooling2D' + i
          }
        }
        )
        .join("path")
        .attr("d", function (d, i) {
          // here is how to use svg code to draw bezier curves for connecting two neurons
          let x1, y1, x2, y2;
          if (d[2] == 'Conv2D' || d[2] == 'Dense') {
            y1 = -neuronVerticalDis;
            x1 = neuronHorizontalDis * d[0] - neuronHorizontalDis * d[1];
            y2 = 0;
            x2 = 0;
            return "M " + x1 + " " + y1 + " "
              + "C " + (x1) + " " + (y1 + curveOffset) + ","
              + (x2) + " " + (y2 - curveOffset) + ","
              + x2 + " " + y2
          } else {
            if (i == 0) {
              y1 = -neuronVerticalDis / 4;
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
        .attr("stroke-width", 1)
        .attr("stroke", "rgb(80,80,80)")
        .attr("fill", "transparent")
        .on('mouseover', weightTip.show) // There is a conflict between d3-tip.show and function but I can't solve it. So I use both "mouseover/out" and "mouseenter/leave"
        .on('mouseout', weightTip.hide)
        .on("mouseenter", function (d) {
          d3.select(this).attr("stroke", "rgb(255,255,255)").attr("stroke-width", 3);
        })
        .on("mouseleave", function (d) {
          d3.select(this).attr("stroke", "rgb(80,80,80)").attr("stroke-width", 1);
        });


      // draw the first input image

      // add a group to contain the input image
      let originalNeuron = nodes
        .append("g")
        .attr("className", "origin")
        .attr("transform",
          "translate(" + chartOffset + "," + chartOffset + ")"
        )
        .on('mouseover', originalNeuronTip.show)
        .on('mouseout', originalNeuronTip.hide)

      // add a point, just decoration
      let originalNeuronPoint = originalNeuron
        .append("circle")
        .attr("className", "circle")
        .attr('r', initialNeuronSize + 'px')
        .attr("cx", 0)
        .attr("cy", 28 * pixelSize)
        .attr("fill", "white")

      // add a rectangle under the image as outline, to make the image more clear in the black background
      let originalNeuronOutline = originalNeuron
        .append("rect")
        .attr("className", "rect")
        .attr("width", function (d) { return 28 * pixelSize + 2 })
        .attr("height", function (d) { return 28 * pixelSize + 2 })
        .attr("x", -1)
        .attr("y", -1)
        .attr("fill", "white")

      // add a container to contain a row of pixels of a neuron
      let originalRow = originalNeuron.selectAll(".row")
        .data(originalImage[0])
        .enter()
        .append("g")
        .attr("className", "row")
        .attr("transform", function (d, i) {
          return "translate(0," + i * pixelSize + ")";
        });

      // draw pixels in the row
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

      // add a group to contain a neuron
      let neuron = nodes.selectAll(".neuron")
        .data(neuronData)
        .enter()
        .append("g")
        .attr("className", "neuron")
        .attr("id", function (d, i) { return "neuron" + i })
        .attr("transform", function (d, i) {
          return "translate(" + (d.neuronIndex * neuronHorizontalDis + chartOffset) + "," + (d.sizeCnt * pixelSize + d.layerConv2DCnt * neuronVerticalDis + d.layerPoolingCnt * neuronVerticalDis / 4 + d.layerDenseCnt * neuronVerticalDis + chartOffset) + ")";
        })
        .on('mouseover', neuronTip.show)
        .on('mouseout', neuronTip.hide)

      // add a point, the point size refers to bias of a neuron
      let neuronPointUp = neuron
        .append("circle")
        .attr("className", "circle")
        .attr('r', function (d, i) {
          if (d.bias == undefined) {
            if (d.layerType == "Dense") {
              return "8px"
            } else {
              return "0px"
            }
          } else {
            return (initialNeuronSize + d.bias[d.neuronIndex] * 250) + "px"
          }
        })
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("fill", "white")

      // add a rectangle under the image as outline, to make the image more clear in the black background
      let neuronPointOutline = neuron
        .append("rect")
        .attr("className", "rect")
        .attr("width", function (d) { return d.tensor2D.length * pixelSize + 2 })
        .attr("height", function (d) { return d.tensor2D.length * pixelSize + 2 })
        .attr("x", -1)
        .attr("y", -1)
        .attr("fill", "white")

      // add a container to contain a row of pixels of a neuron
      let row = neuron.selectAll(".row")
        .data(function (d) { return d.tensor2D })
        .enter()
        .append("g")
        .attr("className", "row")
        .attr("transform", function (d, i) { return "translate(0," + i * pixelSize + ")"; });

      // draw pixels in the row
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

      console.log("CNN_VIS rendered.");


    })();
  }, [props.modelInfo]
  )

  return (
    <div className={'chart-container'} ref={ref}></div>
  )
}

export default CnnVis;