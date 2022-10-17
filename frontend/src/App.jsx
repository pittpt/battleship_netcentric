import React from "react";
import "./App.css";
import Display from "./components/Display";
import LogList from "./components/Log";
import Heading from "./components/Heading";
import useGame from "./hooks/useGame";

const App = () => {
  const { myState, opponentState, logState } = useGame();

  return (
    <>
      <Heading />
      <Display {...{ myState, opponentState }} />
      <LogList {...logState} />
    </>
  );
};

export default App;
