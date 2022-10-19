import React from "react";
import "./App.css";
import View from "./components/Display";
import useGame from "./hooks/useGame";
import Log from "./components/Log";

const App = () => {
  const { myState, opponentState, logState } = useGame();

  return (
    <>
      <View {...{ myState, opponentState }} />
      <Log {...logState} />
    </>
  );
};

export default App;

//don't touch this
