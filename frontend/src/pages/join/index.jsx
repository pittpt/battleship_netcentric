import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Heading from "../../components";
import { MSG_WAITING_FOR_PLAYER } from "../../constants";
import { useNavigate } from "react-router-dom";
import { ToastProvider, useToasts } from "react-toast-notifications";
import useGame from "../../hooks/useGame";
import "./style.css";

const JoinPageForms = () => {
    const [waitingFlag, setWaitingFlag] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const navigate = useNavigate();
    const { addToast } = useToasts();
    // const { myState, opponentState, logState } = useGame();
    const { logState } = useGame();
    const { messages, newGame } = logState;
    useEffect(() => {
        if (messages[messages.length - 1].message === 'Select 5 tiles for your carrier.' && waitingFlag) {
            navigate('/main');
        }
    }, [messages, waitingFlag, navigate])
    const handleWaitingFlag = () => {
        if (playerName !== '') {
            handleProcessing();
        } else {
            addToast("please enter your name", { appearance: "error" });
        }
    }
    const handleWaitingFlagByKey = (event) => {
        if (event.key === 'Enter') {
            if (playerName !== '') {
                handleProcessing();
            } else {
                addToast("please enter your name", { appearance: "error" });
            }
        }
    }
  };
  const handleWaitingFlagByKey = (event) => {
    if (event.key === "Enter") {
      if (playerName !== "") {
        handleProcessing();
      } else {
        addToast("Enter your name!", { appearance: "error" });
      }
    }
    const handleProcessing = () => {
        setWaitingFlag(!waitingFlag);
        newGame();
    }
    return (
      <div className="join-page-container">
        <Heading />
        {!waitingFlag ? (
          <div className="page-content-tab-wrapper">
            <p className="player-status-label">
              Overall Online Player: {playerName}
            </p>
            <p className="label-content">Enter Your Name:</p>
            <input
              type="text"
              placeholder="Enter your name..."
              className="player-name-input"
              onKeyDown={(e) => {
                handleWaitingFlagByKey(e);
              }}
              onChange={(e) => handlePlayerName(e)}
              value={playerName}
            />
            <button className="main-button" onClick={() => handleWaitingFlag()}>
              New Game
            </button>
          </div>
        ) : (
          <div className="page-content-tab-wrapper">
            <p className="player-status-label">Welcome, {playerName}</p>
            <p className="label-content">{MSG_WAITING_FOR_PLAYER}</p>
            <ClipLoader color="#e8175d" />
            <button className="main-button" onClick={() => handleWaitingFlag()}>
              Back
            </button>
          </div>
        )}
      </div>
    );
}

const JoinPage = () => (
  <ToastProvider autoDismiss={true} autoDismissTimeout="2000">
    <JoinPageForms />
  </ToastProvider>
);

export default JoinPage;
