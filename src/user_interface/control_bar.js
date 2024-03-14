// Author: Xiang Li
// UAL Student ID: 23009641
//
// Draw the main UI to control vis and training
// 
// Reference:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
// https://dev.to/diballesteros/how-to-make-a-simple-slider-component-in-react-3nk8
// https://stackoverflow.com/questions/32682962/javascript-loop-through-array-backwards-with-foreach

import React, { useState, useEffect, useLayoutEffect } from "react"

function ControlBar(props) {

    // initialize all the React state for rerendering when data changes or user sets any input
    const [layerList, setLayerList] = useState([]); // state for update STEP1 UI (configure model)
    const [logList, setLogList] = useState([]); // state for update STEP2 UI (training)

    let newConfig = [];

    useEffect(() => {

        (async () => {

            console.log("UI start rendering.");

            newConfig = [];

            if (!props.isTraining) { // set STEP1 UI (configure model before training)

                let newLayerList = [];
                newConfig = [];

                // get the modelConfig info from APP component, loop to set each layers' UI
                props.modelConfig.forEach((layer, index) => {
                    newConfig.push(layer)
                    newLayerList.push(
                        <div key={index} className="ui-container">
                            <div className="operation-container">

                                {/* layer title and index */}
                                <div className="container-title">{layer.layerType}{" - "+index}</div>

                                {/* set filter amount */}
                                <div className="title-container">
                                    <div>Filter Amount: {layer.filters}</div>
                                    <input type="range" min="4" max="16"
                                        onChange={(e) => modifyFilter(index, e.target.value)}
                                        value={layer.filters} />
                                </div>

                                {/* set kernel size */}
                                <div className="title-container">
                                    <div>Kernel Size: {layer.kernelSize}</div>
                                    <input type="range" min="2" max="5"
                                        onChange={(e) => modifyKernel(index, e.target.value)}
                                        value={layer.kernelSize} />
                                </div>

                                {/* set max pooling */}
                                <div className="title-button"
                                    onClick={() => { setMaxPooling(index) }}>
                                   {!layer.isMaxPooling && "Add Max Pooling"}
                                   {layer.isMaxPooling && "Remove Max Pooling"}
                                </div>

                                {props.modelConfig.length > 1 // when only 1 layer left, hide "remove"
                                && (<div className="title-button"
                                    onClick={() => { removeLayer(index) }}>
                                    Remove This Layer
                                </div>)}
                            </div>
                            {props.modelConfig.length <= 4 // when layer amount is larger than 4 there are some array issues so I had to add this limitation
                            && (
                                <div className="title-button add-button"
                                    onClick={() => { addLayer(index) }}>
                                    ADD CONV LAYER
                                </div>)
                            }
                        </div>
                    );
                });

                // update state for rerender UI after set up
                setLayerList(newLayerList);
                console.log(newLayerList);

            } else { // set STEP1 UI (update log of each epoch)

                let newLogList = [];
                let tempTrainingLog = props.trainingLogs.slice().reverse() // get the log and reverse it so that user can always see the newest log on the top

                tempTrainingLog.forEach((log, index) => {
                    newLogList.push(
                        <div key={index} className="ui-container">
                            
                            {/* show epoch index */}
                            <div className="container-title">
                                Epoch: {log[0]}
                            </div>
                            {/* show log detail (loss value and accuracy) */}
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

    // a series of function to edit model configuration
    
    // add new layer
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

    // set filter amount
    function modifyFilter(index, value) {
        newConfig[index].filters = parseInt(value)
        props.setModelConfig(newConfig)
    }

    // set kernel size
    function modifyKernel(index, value) {
        newConfig[index].kernelSize = parseInt(value)
        props.setModelConfig(newConfig)
    }

    // set Max Pooling
    function setMaxPooling(index){
        newConfig[index].isMaxPooling = !newConfig[index].isMaxPooling
        props.setModelConfig(newConfig)
    }

    // remove current layer
    function removeLayer(index) {
        newConfig.splice(index, 1)
        props.setModelConfig(newConfig)
    }

    return (
        <div>
            <div className="control-bar upper-bar">

                {/* description of each step */}
                <div className="bar-title">
                    {/* step index */}
                    <p>
                        {!props.isTraining && "STEP01"}
                        {props.isTraining && !props.isTrainingDone && "STEP02"}
                        {props.isTraining && props.isTrainingDone && "STEP03"}
                    </p>
                    {/* description */}
                    <p>
                        {!props.isTraining && "Configure your CNN model and training"}
                        {props.isTraining && !props.isTrainingDone && "Wait for training..."}
                        {props.isTraining && props.isTrainingDone && "Training is finished, change input digit to check the result"}
                    </p>
                </div>
                {/* show STEP1 UI */}
                {!props.isTraining && layerList}

                {/* show STEP2 & STEP3 UI */}
                {props.isTraining && logList}

            </div>
            <div className="control-bar lower-bar">
            {/* UI for training progess */}
                
                {/* set up epoch number before training */}
                <div className="title-container">
  
                    <div>Epoch: {props.epochCount}</div>
                    <input type="range" min="1" max="10"
                    onChange={(e) => props.setEpochCount(e.target.value)}
                    value={props.epochCount}/>
                        
                </div>

                {/* action button */}
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