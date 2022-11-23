import io from "socket.io-client";
import { useReducer, useEffect } from "react";
import {
  checkIfSameCoordinate,
  makeNewMessages,
  makeMsgForWrongTiles,
  validateShipTiles,
  makeMsgForSelectingTiles,
  checkIfLstIncludesCoordinate,
  isWinner,
  getLastElm,
  findSinkShipNameOfCoordinate,
  makeMsgForSinkShip,
  makeMsgForShot,
  checkIfHit,
  getWinnerOrLoserMsg,
} from "../helpers";
import {
  NEW_OPPONENT,
  NEW_MESSAGE,
  NEW_GAME,
  OPPONENT_LEFT,
  initialState,
  INITIAL_MSG_NO_OPPONENT,
  INITIAL_MSG_HAVE_OPPONENT,
  MSG_HAVE_OPPONENT,
  MSG_NO_OPPONENT,
  ships,
  CLEAR_TILES,
  SELECT_TILE,
  CONFIRM_TILES,
  MSG_INVALID_TILES,
  COMPLETE_SELECTION,
  SET_OPPONENT_SHIPS,
  OPPONENTS_TURN,
  MSG_ATTACK,
  MSG_DEFEND,
  MSG_WAITING_FOR_PLAYER,
  MSG_LOSE,
  MSG_WIN,
  MSG_OPPONENT_PLACING_SHIPS,
  MSG_ENTER_NEW_GAME,
  SHOT,
  OPPONENT_SHOT,
  UPDATE_OVERALL_PLAYER,
  SCORE,
  MY_TURN,
  MSG_RANDOM_PLAYER,
  EMOJI,
  RESET_SCORE,
  END,
} from "../constants";

const socket = io("localhost:4000", { transports: ["websocket"] });
const useGame = () => {
  useEffect(() => {
    socket.emit("players");
  }, []);

  const reducers = {
    [NEW_OPPONENT](state, { opponent, name, lastScore }) {
      const newGameState = opponent ? 1 : 0;
      return {
        ...state,
        opponent,
        opponentScore: Number(lastScore),
        opponentName: name,
        gotInitialOpponent: true,
        gameState: newGameState,
      };
    },
    [NEW_MESSAGE](state, { message }) {
      const { messages } = state;
      const newMessages = makeNewMessages(messages, message);
      return { ...state, haveSendInitialMsg: true, messages: newMessages };
    },
    [NEW_GAME](state, { name }) {
      const { messages, overallPlayer, score } = state;
      const newMessages = makeNewMessages(messages, MSG_ENTER_NEW_GAME);
      return {
        ...initialState(),
        name,
        score,
        overallPlayer,
        messages: newMessages,
      };
    },
    [OPPONENT_LEFT]({ messages, overallPlayer, score, name }) {
      return {
        ...initialState(),
        score,
        name,
        messages,
        overallPlayer,
        haveSendInitialMsg: true,
      };
    },
    [CLEAR_TILES](state) {
      return { ...state, chosenTiles: [] };
    },
    [SELECT_TILE](state, { coordinate: selectedCoordinate }) {
      const { myShips, chosenTiles } = state;
      for (const { coordinates } of myShips) {
        const isOccupied = checkIfLstIncludesCoordinate(
          coordinates,
          selectedCoordinate
        );
        if (isOccupied) return state;
      }

      const isSelected = checkIfLstIncludesCoordinate(
        chosenTiles,
        selectedCoordinate
      );
      const newChosenTiles = isSelected
        ? chosenTiles.filter(
            (coordinate) =>
              !checkIfSameCoordinate(coordinate, selectedCoordinate)
          )
        : chosenTiles.concat([selectedCoordinate]);

      return { ...state, chosenTiles: newChosenTiles };
    },
    [CONFIRM_TILES](state) {
      const { shipTilesState, chosenTiles, messages, myShips } = state;
      const { name, numOfTiles } = ships[shipTilesState];
      const numOfChosenTiles = chosenTiles.length;

      const wrongNumOfTiles = numOfTiles !== numOfChosenTiles;
      if (wrongNumOfTiles) {
        const newMsg = makeMsgForWrongTiles(name, numOfTiles);
        const newMessages = makeNewMessages(messages, newMsg);
        return { ...state, messages: newMessages };
      }

      const sameRow = validateShipTiles(chosenTiles, "row", "column");
      const sameColumn = validateShipTiles(chosenTiles, "column", "row");

      if (!sameRow && !sameColumn) {
        const newMessages = makeNewMessages(messages, MSG_INVALID_TILES);
        return { ...state, messages: newMessages };
      }

      const newShip = { name, coordinates: chosenTiles };
      const newMyShips = myShips.concat([newShip]);
      const newShipTilesState = shipTilesState + 1;

      return {
        ...state,
        myShips: newMyShips,
        shipTilesState: newShipTilesState,
        chosenTiles: [],
      };
    },
    [COMPLETE_SELECTION](state) {
      return { ...state, gameState: 2 };
    },
    [SET_OPPONENT_SHIPS](state, { opponentShips }) {
      const { gameState } = state;
      if (gameState === 2) {
        socket.emit("ready");
      }
      return { ...state, opponentShips };
    },
    [OPPONENTS_TURN](state) {
      return { ...state, gameState: 4 };
    },
    [SHOT](state, { coordinate }) {
      const { opponentShipsShot, opponentShips, score } = state;
      const alreadyShot = checkIfLstIncludesCoordinate(
        opponentShipsShot,
        coordinate
      );
      if (alreadyShot) return state;

      const newOpponentShipsShot = opponentShipsShot.concat([coordinate]);
      const hasWon = isWinner(opponentShips, newOpponentShipsShot);
      console.log(opponentShips, coordinate);
      const isHit = checkIfHit(opponentShips, coordinate);
      console.log("isHit", isHit);
      const msgType = hasWon ? "end" : "shot";
      const newGameState = hasWon ? 5 : isHit ? 3.5 : 4;
      socket.emit(msgType, coordinate);
      const newScore = hasWon ? score + 1 : score;

      if (hasWon) {
        socket.emit("win");
      }

      return {
        ...state,
        opponentShipsShot: newOpponentShipsShot,
        gameState: newGameState,
        score: newScore,
      };
    },
    [OPPONENT_SHOT](state, { coordinate }) {
      const { myShipsShot, myShips } = state;
      const newMyShipsShot = myShipsShot.concat([coordinate]);
      const isHit = checkIfHit(myShips, coordinate);
      const newGameState = isHit ? 4 : 3;
      return {
        ...state,
        myShipsShot: newMyShipsShot,
        gameState: newGameState,
      };
    },
    [UPDATE_OVERALL_PLAYER](state, { players }) {
      return {
        ...state,
        overallPlayer: players,
      };
    },
    [SCORE](state, { score, opponentScore }) {
      return {
        ...state,
        score,
        opponentScore,
      };
    },
    [MY_TURN](state) {
      return {
        ...state,
        gameState: 3,
      };
    },
    [EMOJI](state, { id }) {
      return {
        ...state,
        emojiId: id,
      };
    },
    [RESET_SCORE](state) {
      return {
        ...state,
        score: 0,
        opponentScore: 0,
      };
    },
    [END](state) {
      const { opponentScore, gameState } = state;
      console.log("end", opponentScore, gameState);
      const newOpponentScore =
        gameState === 4 ? opponentScore + 1 : opponentScore;
      return { ...state, opponentScore: newOpponentScore, gameState: 6 };
    },
  };

  const reducer = (state, action) => {
    return reducers[action.type](state, action) || state;
  };

  const [state, dispatch] = useReducer(reducer, initialState());

  const {
    gotInitialOpponent,
    opponent,
    haveSendInitialMsg,
    gameState,
    myShips,
    opponentShips,
    messages,
    shipTilesState,
    chosenTiles,
    opponentShipsShot,
    myShipsShot,
    overallPlayer,
    name,
    opponentName,
    score,
    opponentScore,
    emojiId,
  } = state;

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected to server");
    });

    socket.on("opponent", (opponent, name, lastScore) => {
      dispatch({ opponent, name, lastScore, type: NEW_OPPONENT });
    });

    socket.on("opponentShips", (opponentShips) => {
      dispatch({ type: SET_OPPONENT_SHIPS, opponentShips });
    });

    socket.on("shot", (coordinate) => {
      dispatch({ type: OPPONENT_SHOT, coordinate });
    });

    socket.on("updateOverallPlayer", (players) => {
      dispatch({ type: UPDATE_OVERALL_PLAYER, players });
    });

    socket.on("resetScore", () => {
      dispatch({ type: RESET_SCORE });
    });

    socket.on("turn", (who) => {
      dispatch({ type: NEW_MESSAGE, message: MSG_RANDOM_PLAYER });
      dispatch({ type: who === "your" ? MY_TURN : OPPONENTS_TURN });
    });

    socket.on("emoji", (id) => {
      dispatch({ type: EMOJI, id });
    });

    socket.on("end", (coordinate) => {
      dispatch({ type: OPPONENT_SHOT, coordinate });
      dispatch({ type: END });
    });

    return () => {
      socket.off("connect");
      socket.off("opponent");
      socket.off("opponentShips");
      socket.off("shot");
      socket.off("updateOverallPlayer");
      socket.off("turn");
      socket.off("emoji");
      socket.off("end");
    };
  }, []);

  useEffect(() => {
    if (gotInitialOpponent) {
      const message = opponent
        ? haveSendInitialMsg
          ? MSG_HAVE_OPPONENT
          : INITIAL_MSG_HAVE_OPPONENT
        : haveSendInitialMsg
        ? MSG_NO_OPPONENT
        : INITIAL_MSG_NO_OPPONENT;

      dispatch({ type: NEW_MESSAGE, message });
      if (!opponent) dispatch({ type: OPPONENT_LEFT });
    }
  }, [opponent, gotInitialOpponent, haveSendInitialMsg]);

  useEffect(() => {
    switch (gameState) {
      case 1:
        const { numOfTiles, name } = ships[0];
        dispatch({
          type: NEW_MESSAGE,
          message: makeMsgForSelectingTiles(name, numOfTiles),
        });
        break;
      case 2:
        socket.emit("ships", myShips);
        break;
      case 3: // our turn
        const opponentLastShot = getLastElm(myShipsShot);
        if (opponentLastShot) {
          const shotMsg = makeMsgForShot(false, myShips, opponentLastShot);
          dispatch({ type: NEW_MESSAGE, message: shotMsg });

          const justSinkShipName = findSinkShipNameOfCoordinate(
            myShips,
            opponentLastShot,
            myShipsShot
          );
          if (justSinkShipName) {
            const sinkMsg = makeMsgForSinkShip(false, justSinkShipName);
            dispatch({ type: NEW_MESSAGE, message: sinkMsg });
          }
        }
        dispatch({ type: NEW_MESSAGE, message: MSG_ATTACK });
        break;
      case 3.5: // reset before go back to our turn
        dispatch({ type: MY_TURN });
        break;
      case 4: // opponent turn
        const myLastShot = getLastElm(opponentShipsShot);
        if (myLastShot) {
          const shotMsg = makeMsgForShot(true, opponentShips, myLastShot);
          dispatch({ type: NEW_MESSAGE, message: shotMsg });

          const justSinkShipName = findSinkShipNameOfCoordinate(
            opponentShips,
            myLastShot,
            opponentShipsShot
          );
          if (justSinkShipName) {
            const sinkMsg = makeMsgForSinkShip(true, justSinkShipName);
            dispatch({ type: NEW_MESSAGE, message: sinkMsg });
          }
        }

        dispatch({ type: NEW_MESSAGE, message: MSG_DEFEND });
        break;
      case 5:
        dispatch({ type: NEW_MESSAGE, message: MSG_WIN });
        break;
      case 6:
        dispatch({ type: NEW_MESSAGE, message: MSG_LOSE });
        break;
      default:
    }
  }, [gameState, myShips, myShipsShot, opponentShips, opponentShipsShot]);

  useEffect(() => {
    socket.emit("board", opponentShips, opponentShipsShot);
  }, [opponentShips, opponentShipsShot]);

  useEffect(() => {
    switch (shipTilesState) {
      case 0:
        break;
      case ships.length:
        dispatch({ type: COMPLETE_SELECTION });
        break;
      default:
        const { numOfTiles, name } = ships[shipTilesState];
        dispatch({
          type: NEW_MESSAGE,
          message: makeMsgForSelectingTiles(name, numOfTiles),
        });
    }
  }, [shipTilesState]);

  const newGame = (payload) => {
    if (!payload) {
      payload = { name };
    }
    dispatch({ type: NEW_GAME, name: payload.name });
    socket.emit("newGame", payload);
  };

  const showOpponentOverlay =
    gameState === 0
      ? MSG_WAITING_FOR_PLAYER
      : !opponentShips
      ? MSG_OPPONENT_PLACING_SHIPS
      : null;

  const showMyOverlay =
    gameState === 5 ? MSG_WIN : gameState === 6 ? MSG_LOSE : null;

  const showConfirmCancelButtons = gameState === 1;

  const clearTiles = () => {
    dispatch({ type: CLEAR_TILES });
  };

  const clickTile = (myBoard) => {
    if (myBoard) {
      return (coordinate) => {
        if (gameState === 1) dispatch({ type: SELECT_TILE, coordinate });
      };
    }
    return (coordinate) => {
      if (gameState === 3) {
        dispatch({ type: SHOT, coordinate });
      }
    };
  };

  const onTimeout = () => {
    // Shot somewhere missed
    dispatch({
      type: SHOT,
      coordinate: {
        row: -1,
        column: -1,
      },
    });
  };

  const confirmTiles = () => dispatch({ type: CONFIRM_TILES });

  const sendEmoji = (id) => {
    socket.emit("emoji", id);
  };

  const popupMessage =
    gameState === 5
      ? getWinnerOrLoserMsg(true, name)
      : gameState === 6
      ? getWinnerOrLoserMsg(false, name)
      : "";

  const logState = { messages, popupMessage, newGame };

  const myState = {
    myBoard: true,
    placedShips: myShips,
    overlaySettings: showMyOverlay,
    title: "Your Board",
    showConfirmCancelButtons,
    clearTiles,
    clickTile: clickTile(true),
    chosenTiles,
    confirmTiles,
    onTimeout: onTimeout,
    shot: myShipsShot,
    active: gameState === 4,
    playerName: name,
    score: score,
    sendEmoji,
    emojiId,
  };

  const opponentState = {
    placedShips: opponentShips,
    overlaySettings: showOpponentOverlay,
    title: "Opponent's Board",
    clickTile: clickTile(),
    chosenTiles: [],
    onTimeout: onTimeout,
    shot: opponentShipsShot,
    active: gameState === 3,
    playerName: opponentName,
    opponentScore: opponentScore,
  };

  return { logState, myState, opponentState, overallPlayer };
};

export default useGame;
