//https://blog.logrocket.com/getting-started-d3-js-react/

import React, { useState, useEffect, useCallback, Component } from "react"
import * as d3 from "d3"

function Chart(props) {

    const ref = React.useRef(null) // Use React ref to control DOM elements for D3

    useEffect(() => {
        (async () => {
        const data = [12, 5, 6, 6, 9, 10];

        

        const svgContainer = d3.select(ref.current);
        svgContainer.selectAll("*").remove(); // remove former charts to avoid drawing twice or more
        
        // create svg chart
        const svg = svgContainer
                    .append("svg")
                    .attr("width", 700)
                    .attr("height", 300);

        const node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(data)
            .join("circle")
            .attr("r", 5)
            .attr("fill", "#fff");

        // svg.selectAll("circle")
        //     .data(data)
        //     .enter()
        //     .append("rect")
        //     .attr("x", (d, i) => i * 70)
        //     .attr("y", (d, i) => 300 - 10 * d)
        //     .attr("width", 65)
        //     .attr("height", (d, i) => d * 10)
        //     .attr("fill", "green");
        
        })();
    }, [props.scaleSend, props.selectCases, props.selectPolicy, props.selectVote, props.selectGunRate,props.selectCity,props.selectUni,props.searchData,props.selectSerious,props.selectLowerRange]
    )
    
    return (
        <div id={'main'} ref={ref}></div>
    )
}

export default Chart;