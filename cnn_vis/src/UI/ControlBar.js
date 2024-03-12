// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
// https://dev.to/diballesteros/how-to-make-a-simple-slider-component-in-react-3nk8

import React, { useState, useEffect, useLayoutEffect } from "react"

function ControlBar(props) {

    let layerList = [];

    let newConfig = [];

    // const [value, setValue] = useState(0);

    props.modelConfig.forEach((layer, index) => {
        newConfig.push(layer)

        layerList.push(
            <div key={index}>
                <div
                >
                    <div
                    className="title-button"
                    onClick={() => {
                        removeLayer(index)
                    }}
                    >{layer.layerType}
                    </div>
                        <input type="range" min="4" max="16" 
                        onChange={(e) => setFilter(index,e.target.value)}
                        value={layer.filters}
                        />
                </div>

                <div
                    className="title-button add-button"
                    onClick={() => {
                        addLayer(index)
                    }}
                >ADD
                </div>
            </div>
        );
    });

    function removeLayer(index) {
        newConfig.splice(index, 1)
        props.setModelConfig(newConfig)
    }

    function addLayer(index) {
        newConfig.splice(index, 0, {
            'layerType': 'Conv2D',
            'kernelSize': 5,
            'filters': 8,
            'strides': 1,
            'activation': 'relu',
            'kernelInitializer': 'varianceScaling'
        })
        props.setModelConfig(newConfig)
    }

    function setFilter(index, value) {
        newConfig[index].filters = parseInt(value)
        props.setModelConfig(newConfig)
    }

    function removeLayer(index) {
        newConfig.splice(index, 1)
        props.setModelConfig(newConfig)
    }

    return (
        <div className="control-bar">
            {!props.isTraining && layerList}
            <div className="title-button"
                onClick={() => {
                    props.trainingToggle()
                }}>
                Train

            </div>
        </div>
    )
}


export default ControlBar