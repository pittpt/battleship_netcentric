import React from "react";
import "./Log.css";
import NewGameButton from "./NewGameButton";

const LogList = ({ messages, newGame }) => {

  messages.map(({ time, message }, index) => {
    console.log(message)
  });

  return (
    <div className="log-display">
      <NewGameButton {...{ newGame }} />
    </div>
  );
};

export default LogList;
