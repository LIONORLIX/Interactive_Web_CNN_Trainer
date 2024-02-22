//https://blog.logrocket.com/getting-started-d3-js-react/

import React, { useState, useEffect, useCallback, Component } from "react"
import * as tf from '@tensorflow/tfjs';
import * as d3 from "d3"

import {loadModel} from "../methods/load_model_data.js"

function Chart(props) {

    const ref = React.useRef(null) // Use React ref to control DOM elements for D3
    const [layers, setLayers] = useState([]);

    useEffect(() => {
    (async () => {

        loadModel();
        
        const data = [ 12, 5, 6, 6, 9, 10 ];
        const svgContainer = d3.select(ref.current);
        svgContainer.selectAll("*").remove(); // remove former charts to avoid drawing twice or more
        
        // create svg chart
        const svg = svgContainer
                    .append("svg")
                    .attr("width", 700)
                    .attr("height", 300);
        
        const nodes = svg.append("g")
        for (let i=0;i<data.length;i++)
        { 
            nodes.selectAll("circle")
            .data(data)
            .join("circle")
                .attr("r", 5)
                .attr("cx", function(d,i){ 
                    return i*80+50 })
                .attr("cy", function(d,i){ 
                    for (let i=0; i<d; i++){
                        console.log(i)
                        return i*80+50
                    }
                    })
                .attr("fill", "#000");
        }
        })();
    }, []
    )
    
    return (
        <div id={'main'} ref={ref}></div>
    )
}

export default Chart;