import React from 'react';
import Coordinate from './Coordinate';
import ShipList from './ShipList';
import Overlay from './Overlay';
import './Board.css';
import { useEffect } from 'react';
import { yourName } from '../../../helpers';

const Board = ({ state }) => {
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

  const boardClass = active ? 'board active' : 'board';

  const coordinate = (
    <div className={boardClass}>
      <h4 style={{ color: 'white' }}>{title}</h4>
      <p>{yourName}</p>
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
    <div className="whole-board">
      {board}
      <Overlay settings={overlaySettings} />
    </div>
  );
};

export default Board;
