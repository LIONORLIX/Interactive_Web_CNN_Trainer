// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
// https://dev.to/diballesteros/how-to-make-a-simple-slider-component-in-react-3nk8
// https://stackoverflow.com/questions/32682962/javascript-loop-through-array-backwards-with-foreach

import React, { useState, useEffect, useLayoutEffect } from "react"

function ControlBar(props) {

    const [layerList, setLayerList] = useState([]);
    const [logList, setLogList] = useState([]);

    let newConfig = [];

    // const [value, setValue] = useState(0);
    useEffect(() => {

        (async () => {

            newConfig = [];

            console.log("UI start rendering.");

            if (!props.isTraining) {

                let newLayerList = [];
                newConfig = [];

                console.log("untrained")
                props.modelConfig.forEach((layer, index) => {
                    newConfig.push(layer)
                    newLayerList.push(
                        <div key={index} className="ui-container">
                            <div className="operation-container">

                                <div className="container-title">{layer.layerType}{" - "+index}</div>
                                <div className="title-container">
                                    <div>Filter Number: {layer.filters}</div>
                                    <input type="range" min="4" max="16"
                                        onChange={(e) => modifyFilter(index, e.target.value)}
                                        value={layer.filters} />
                                </div>
                                <div className="title-container">
                                    <div>Kernel Size: {layer.kernelSize}</div>
                                    <input type="range" min="2" max="5"
                                        onChange={(e) => modifyKernel(index, e.target.value)}
                                        value={layer.kernelSize} />
                                </div>
                                <div className="title-button"
                                    onClick={() => { setMaxPooling(index) }}>
                                   {!layer.isMaxPooling && "Add Max Pooling"}
                                   {layer.isMaxPooling && "Remove Max Pooling"}
                                </div>
                                <div className="title-button"
                                    onClick={() => { removeLayer(index) }}>
                                    Remove This Layer
                                </div>
                            </div>
                            {props.modelConfig.length <= 5 && (
                                <div className="title-button add-button"
                                    onClick={() => { addLayer(index) }}>
                                    ADD CONV LAYER
                                </div>)
                            }
                        </div>
                    );
                });
                setLayerList(newLayerList);
                console.log(newLayerList);
            } else {

                let newLogList = [];

                props.trainingLogs.reverse().forEach((log, index) => {
                    newLogList.push(
                        <div key={index} className="ui-container">
                            
                            <div className="container-title">
                                Epoch: {log[0]}
                            </div>
                            <div className="title-container">
                                <p>Loss: {log[1].toFixed(8)}</p>
                               <p>Accuracy: {log[2].toFixed(8)}</p>
                            </div>
                        </div>
                    );
                })
                setLogList(newLogList);
                console.log(newLogList);
            }

            console.log("UI rendered.");
        })();

    }, [props.modelConfig, props.epoch, props.isTrainingDone]);

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

    function modifyFilter(index, value) {
        newConfig[index].filters = parseInt(value)
        props.setModelConfig(newConfig)
    }

    function modifyKernel(index, value) {
        newConfig[index].kernelSize = parseInt(value)
        props.setModelConfig(newConfig)
    }

    function setMaxPooling(index){
        newConfig[index].isMaxPooling = !newConfig[index].isMaxPooling
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
                    <p>
                        {!props.isTraining && "STEP01"}
                        {props.isTraining && !props.isTrainingDone && "STEP02"}
                        {props.isTraining && props.isTrainingDone && "STEP03"}
                    </p>
                    <p>
                        {!props.isTraining && "Configure your CNN model and training"}
                        {props.isTraining && !props.isTrainingDone && "Wait for training..."}
                        {props.isTraining && props.isTrainingDone && "Training is finished, change input digit to check the result"}
                    </p>

                </div>
                {!props.isTraining && layerList}
                {props.isTraining && logList}
            </div>
            <div className="control-bar lower-bar">
                <div className="title-container">
                    <div>Epoch: {props.epochCount}</div>
                    <input type="range" min="1" max="10"
                    onChange={(e) => props.setEpochCount(e.target.value)}
                    value={props.epochCount}/>
                        
                </div>
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