//https://blog.logrocket.com/getting-started-d3-js-react/

import React, { useState, useEffect, useCallback, Component } from "react"
import * as tf from '@tensorflow/tfjs';
import * as d3 from "d3"

import {loadModel} from "../methods/load_model_data.js"

function Chart(props) {

    const ref = React.useRef(null) // Use React ref to control DOM elements for D3
    // const [layers, setLayers] = useState([]);
    const [layerData, setLayerData] = useState([]);
    const [neuronData, setneuronData] = useState([]);

    useEffect(() => {
    (async () => {

        const Data = await loadModel();
        const layerData = Data.layerJSON;
        const neuronData = Data.neuronJSON;
        setLayerData(layerData);
        setneuronData(neuronData);
        console.log(neuronData);

        // data = data.layerConv2DIndex;
        // console.log(layerData);

        const svgContainer = d3.select(ref.current);
        svgContainer.selectAll("*").remove(); // remove former charts to avoid drawing twice or more
        
        // create svg chart
        const svg = svgContainer
                    .append("svg")
        
        const nodes = svg.append("g")
        
        nodes.selectAll("circle")
        .data(neuronData)
        .enter()
        .append("circle")
          .attr("r", 5)
          .attr("cx", function (d) {
            
            return d.layerConv2DIndex * 80 + 100
            
        })
          .attr("cy", function (d) {
            
                
            return d.neuronIndex * 15+100
                
            
        })
          .attr("fill", "#000");
        
        })();
    }, []
    )
    
    return (
        <div id={'main'} ref={ref}></div>
    )
}

export default Chart;