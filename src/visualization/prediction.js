// Author: Xiang Li
// UAL Student ID: 23009641
//
// Draw the prediction histogram for evaluating training output
// 
// Reference:
// https://observablehq.com/@d3/histogram/2
// https://www.freecodecamp.org/news/d3js-tutorial-data-visualization-for-beginners/
// https://stackoverflow.com/questions/20644415/d3-appending-text-to-a-svg-rectangle
// https://stackoverflow.com/questions/16620267/how-to-center-text-in-a-rect-element-in-d3

import React, { useState, useEffect, useCallback, Component } from "react"
// import d3.js for visulization
import * as d3 from "d3"
import d3Tip from "d3-tip"

function Prediction(props) {

    // use React ref to control DOM elements for D3
    const ref = React.useRef(null)

    useEffect(() => {
        (async () => {

            console.log("PREDICTION start rendering.");

            // set a series of parameters for drawing chart
            const barWidth = 42
            const gap = 4;
            const fullBarHeight = 120;
            const width = (barWidth+gap)*10;
            const height = 150;

            // get the output of Dense layer, an 1D array
            const layerData = props.modelInfo.layerJSON;
            const predictionData = layerData[layerData.length-1].tensor[0]

            // remove former charts to avoid drawing twice or more when rerender
            const svgContainer = d3.select(ref.current);
            svgContainer.selectAll("*").remove();

            // create svg canvas
            const svg = svgContainer
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [0, 0, width, height])
                .attr("style", "max-width: 100%; height: auto;");

            // draw background of each bar in histogram
            const prediction = svg.append("g")
                .selectAll()
                .data(predictionData)
                .enter()
                .append("rect")
                .attr("fill", "rgb(50,50,50)")
                .attr("x", function(d,i){
                    return gap+i*(barWidth+gap)
                })
                .attr("width", barWidth)
                .attr("y", 20)
                .attr("height", fullBarHeight)

            // draw each bar in histogram
            svg.append("g")
            .selectAll()
            .data(predictionData)
            .enter()
            .append("rect")
                .attr("x", function(d,i){
                    return gap+i*(barWidth+gap)
                })
                .attr("fill", "white")
                .attr("width", barWidth)
                .attr("y", 20)
                .attr("height", function(d){
                    return fullBarHeight*d
                })

            // set X-scale
            svg.append("g")
                .selectAll()
                .data(predictionData)
                .enter()
                .append("text")
                    .attr("x", function(d,i){
                        return gap+i*(barWidth+gap)+barWidth/2
                    })
                    .attr("y", 10)
                    .attr("dy", 2)
                    .attr("fill", "white")
                    .style("text-anchor", "middle")
                    .text(function(d,i) { 
                        // show class, value of X-scale is name of different classes
                        if (i==0){
                            return "zero"
                        }else if(i==1){
                            return "one"
                        }else if(i==2){
                            return "two"
                        }else if(i==3){
                            return "three"
                        }else if(i==4){
                            return "four"
                        }else if(i==5){
                            return "five"
                        }else if(i==6){
                            return "six"
                        }else if(i==7){
                            return "seven"
                        }else if(i==8){
                            return "eight"
                        }else{
                            return "nine"
                        }
                    });

            console.log("PREDICTION rendered.");

        })();
    }, [props.modelInfo, props.epoch, props.isChangeImage]
    )

    return (
        <div className={'prediction-container'}>
            
            <div ref={ref}>
            </div>
            {/* chart title */}
            <div className={'prediction-title'}>PREDICTION of Handwritten Digits</div>
        </div>
    )
}

export default Prediction;