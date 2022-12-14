import React from "react";
import { useNavigate } from "react-router-dom";

const Heading = ({ title }) => {
  const navigate = useNavigate();
  return (
    <div
      className="heading "
      style={{ cursor: "pointer" }}
      onClick={() => navigate("/")}
    >
      <h1>[ Battleship{title && title} ]</h1>
    </div>
  );
};

export default Heading;
