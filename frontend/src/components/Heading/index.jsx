import React from "react";
import { useNavigate } from "react-router-dom";
import "./Heading.css"
const Heading = ({ title, myScore, showScore, opponentScore }) => {
  const navigate = useNavigate();
  return (
    <div className="heading" style={{ cursor: 'pointer' }} onClick={() => navigate("/")}>
      <h3>{showScore && (myScore ?? 0).toString().padStart(2, "0")}</h3>
      <h1>[ Battleship{(title) && title} ]</h1>
      <h3>{showScore && (opponentScore ?? 0).toString().padStart(2, "0")}</h3>
    </div>
  );
};

export default Heading;
