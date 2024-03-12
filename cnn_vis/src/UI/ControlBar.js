// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
// https://dev.to/diballesteros/how-to-make-a-simple-slider-component-in-react-3nk8

import React, { useState, useEffect, useLayoutEffect } from "react"

function ControlBar(props) {

    const [layerList, setLayerList] = useState([]);
    const [logList, setLogList] = useState([]);

    let newConfig = [];

    // const [value, setValue] = useState(0);
    useEffect(() => {

        (async () => {

            let newConfig = [];

            console.log("UI start rendering.");

            if (!props.isTraining){

                let newLayerList = [];
                newConfig = [];

                console.log("untrained")
                props.modelConfig.forEach((layer, index) => {
                    newConfig.push(layer)
                    newLayerList.push(
                        <div key={index}>
                            <div
                                className="operation-container"
                            >
                                <div
                                    className="title-button"
                                    onClick={() => {
                                        removeLayer(index)
                                    }}
                                >{layer.layerType}
                                </div>
                                Filters <input type="range" min="4" max="16"
                                    onChange={(e) => setFilter(index, e.target.value)}
                                    value={layer.filters}
                                />
                            </div>
                            {props.modelConfig.length <= 5 && (
                                <div
                                    className="title-button add-button"
                                    onClick={() => {
                                        addLayer(index)
                                    }}
                                >ADD CONV LAYER
                                </div>)
                            }
                        </div>
                    );
                });
                setLayerList(newLayerList);
                console.log(newLayerList);
            }else{

                let newLogList = [];

                props.trainingLogs.forEach((log, index) => {
                    newLogList.push(
                        <div key={index}>
                            {"Epoch: " + log[0] + "Loss: " + log[1] + "Accuracy: " + log[2]}
                        </div>
                    );
                })   
                setLogList(newLogList); 
                console.log(newLogList);
            }

            console.log("UI rendered.");
        })();

    }, [props.modelConfig, props.epoch, props.isTrainingDone]);

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
        <div>
            <div className="control-bar upper-bar">
                <div className="bar-title">
                    {!props.isTraining && "Configure your CNN model"}
                    {props.isTraining && !props.isTrainingDone && "Your model is under training..."}
                    {props.isTraining && props.isTrainingDone && "Training is finished"}

                </div>
                {!props.isTraining && layerList}
                {props.isTraining && logList}
            </div>
            <div className="control-bar lower-bar">
                <div className="title-button train-button"
                    onClick={() => {
                        props.trainingToggle()
                    }}>
                    {!props.isTraining && "START TRAINING"}
                    {props.isTraining && !props.isTrainingDone && "CANCEL TRAINING"}
                    {props.isTraining && props.isTrainingDone && "CONFIGURE AGAIN"}
                </div>
            </div>
        </div>
    )
}


export default ControlBar