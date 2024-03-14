// Author: Xiang Li
// UAL Student ID: 23009641
//
// Draw the button of changing input image for visualization
//

import React, { useState, useEffect, useLayoutEffect } from "react"

function ChangeImage(props) {

    return (
        <div className="change-button" onClick={() => {
            let newState = props.isChangeImage
            props.setIsChangeImage(!newState)
        }}>
            Change Digit
        </div>
    )
}

export default ChangeImage