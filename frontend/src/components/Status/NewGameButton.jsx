import React from "react";

const NewGameButton = ({ newGame }) => {
  return (
    <>
      <button className="main-button new-game" onClick={() => newGame(null)}>New Game</button>
    </>
  );
};

export default NewGameButton;
