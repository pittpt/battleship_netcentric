import React from "react";
import NewGameButton from "../Status/NewGameButton";
import "./overlay.css";

const ScreenOverlay = ({
  playerName,
  score,
  opponentScore,
  onClose,
  newGame,
}) => {
  const title =
    score > opponentScore ? `${playerName} wins!` : `${playerName} loses!`;

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        position: "fixed",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "4rem",
        zIndex: 100,
        color: "white",
        backdropFilter: "blur(4px)",
      }}
    >
      <div style={{ fontSize: 80 }}>{title}</div>
      <div style={{ fontSize: 48 }}>{`${score} : ${opponentScore}`}</div>
      <button type="button" className="continue-button" onClick={onClose}>
        <span>Back To Board → </span>
      </button>
      <NewGameButton newGame={newGame} />
    </div>
  );
};

export default ScreenOverlay;
