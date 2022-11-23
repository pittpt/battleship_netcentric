const game = (clients, socket, io, scores, clientNames, boardStatus) => {
  const getSocketById = (id) => io.sockets.sockets.get(id);

  const sendShot = (coordinate) => {
    getSocketById(clients[socket.id]).emit('shot', coordinate);
  };

  const addScore = () => {
    if (scores[socket.id]) {
      scores[socket.id] += 1;
    } else {
      scores[socket.id] = 1;
    }
  };

  const sendShips = (ships) => {
    getSocketById(clients[socket.id]).emit('opponentShips', ships);
  };

  const randomPlayer = () => {
    console.log('randomPlayer', clients);
    if (Math.random() > 0.5) {
      console.log('randomPlayer turn', socket.id);
      getSocketById(clients[socket.id]).emit('turn', 'your');
    } else {
      getSocketById(socket.id).emit('turn', 'opponent');
    }
  };

  const sendEmoji = (emoji) => {
    getSocketById(clients[socket.id])?.emit('emoji', emoji);
  };

  const updateBoard = (opponentShips, opponentShipsShot) => {
    boardStatus[clients[socket.id]] = {
      opponentShips,
      opponentShipsShot,
    };
  };

  const resetScore = (scores) => {
    for (const key in scores) {
      scores[key] = 0;
    }
    io.sockets.emit('resetScore');
  };

  return {
    sendShot,
    sendShips,
    addScore,
    randomPlayer,
    updateBoard,
    sendEmoji,
    resetScore,
  };
};

export default game;
