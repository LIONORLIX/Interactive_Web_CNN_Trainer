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