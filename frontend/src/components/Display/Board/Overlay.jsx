import React from "react";

const Overlay = ({ settings, myBoard }) => {
  const style = settings ? { display: "flex" } : {};
  return (
    <div className={`overlay  ${myBoard ? "mine" : ""}`} style={style}>
      <h2>{settings && settings}</h2>
    </div>
  );
};

export default Overlay;
