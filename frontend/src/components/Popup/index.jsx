import React, { useState } from "react";
import "./style.css";
import NewGameButton from "../Status/NewGameButton";
const Popup = ({ children, myScore, opponentScore, newGame }) => {
    return (
        <div className="popup">
            <div className="popup-message"> {children}</div>
            <div className="score">{myScore} : {opponentScore}</div>
            <NewGameButton {...{ newGame }} />
        </div>
    )
}

export default Popup;