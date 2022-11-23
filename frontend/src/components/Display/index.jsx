import React from "react";
import Board from "./Board/";
import StatusBoard from "../Status";
import "./Display.css";

const Display = ({ myState, opponentState, newGame }) => {
  return (
    <div className="display">
      <Board state={myState} />
      <Board state={opponentState} />
      <StatusBoard {...{ newGame, myState }} />
    </div>
  );
};

export default Display;
