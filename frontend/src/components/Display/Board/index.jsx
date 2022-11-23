import React from "react";
import Coordinate from "./Coordinate";
import ShipList from "./ShipList";
import Overlay from "./Overlay";
import Name from "./Name"
import "./Board.css";

const Board = ({ state, isAdmin }) => {
  const {
    myBoard,
    placedShips,
    overlaySettings,
    title,
    showConfirmCancelButtons,
    clearTiles,
    clickTile,
    chosenTiles,
    confirmTiles,
    shot,
    active,
  } = state;

  const boardClass = active ? "board active" : "board";

  const coordinate = (
    <div className={boardClass}>
      <h3>{title}</h3>
      <Coordinate {...{ placedShips, clickTile, chosenTiles, shot, myBoard }} />
    </div>
  );

  const shipList = (
    <ShipList
      {...{
        active,
        placedShips,
        showConfirmCancelButtons,
        clearTiles,
        confirmTiles,
        shot,
      }}
    />
  );

  const board = myBoard ? (
    <>
      {shipList}
      {coordinate}
    </>
  ) : (
    <>
      {coordinate}
      {shipList}
    </>
  );
  return (
    <div>
      {!isAdmin && <Name {...{ state }} />}
      <div className={`whole-board`}>
        {board}
        <Overlay settings={overlaySettings} {...{ myBoard }} />
      </div>
    </div>
  );
};

export default Board;
