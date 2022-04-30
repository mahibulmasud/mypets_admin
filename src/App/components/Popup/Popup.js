import React, { useEffect } from "react";
import './Popup.css'

export default function Popup(props) {

    const containerSize = {
        height: props.popupHeight,
        width: "40vw",
        //minWidth: (props.minWidth ? props.minWidth : "fit-content")
    };

    useEffect(() => {
        document.body.classList.add('popup-open');
        return function cleanup() {
            document.body.classList.remove('popup-open');
        };
    });

    return (
        <div className="popup-mask">
            <div className="popup-container " style={containerSize}>
                <div className="popup-close-btn" onClick={props.onClosed}>
                    <i className="fa fa-times" />
                </div>
                {
                    props.content
                }
            </div>
        </div>
    )
};
