import React, { useEffect, useState } from "react";
import Board from "./Board/";
import StatusBoard from "../Status";
import Countdown from 'react-countdown'
import "./Display.css";
import { SECS_PER_ROUND } from "../../constants";
import ScreenOverlay from "../ScreenOverlay";
import PlayerStatus from "../PlayerStatus";

const Display = ({ myState, opponentState, newGame, gameState }) => {

  const [closeOverlay, setCloseOverlay] = useState(true)

  const countDownRenderer = ({ seconds }) => {

    return <p
      style={{
        color: 'white'
      }}
    >
      Time Remaining: 
      <span
        style={{
          margin: "0px 20px",
          fontSize: 48,
        }}
      >{seconds}
      </span>
      Seconds
    </p>
  }

  useEffect(() => {
    if ( gameState >= 5 ){
      setCloseOverlay(false)
    }
  }, [gameState])

  const onTimeOut = () => {
    if ( gameState == 3){
      myState.timeOut()
    }
  }

  const handleOverlayClose = () => {
    setCloseOverlay(true)
  }

  return (
    <>
      <PlayerStatus 
        isPlayerOneOnline={true} 
        isPlayerTwoOnline={gameState >= 1} 
      />
      {gameState >= 5 && !closeOverlay &&
      <ScreenOverlay 
        playerName={myState.playerName}
        score={myState.score} 
        opponentScore={opponentState.score} 
        onClose={handleOverlayClose}
        newGame={newGame}
      />}
      {gameState == 3 && <Countdown
         date={Date.now() + (SECS_PER_ROUND * 1000)} 
         renderer={countDownRenderer} 
         onComplete={onTimeOut}
      />}
      {gameState == 4 && <Countdown
         date={Date.now() + (SECS_PER_ROUND * 1000)} 
         renderer={countDownRenderer} 
      />}
      <div className="display">
        <Board state={myState} />
        <Board state={opponentState} />
        <StatusBoard score={myState.score} {...{ newGame }} />
      </div>
    </>
  );
};

export default Display;
