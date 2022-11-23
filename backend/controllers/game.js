const game = (clients, socket, io) => {
  const getSocketById = (id) => io.sockets.sockets.get(id);

  const sendShot = (coordinate, score) => {
    getSocketById(clients[socket.id]).emit("shot", coordinate, score);
  };

  const sendShips = (ships) => {
    getSocketById(clients[socket.id]).emit("opponentShips", ships);
  };

  const sendOpponentTimeOut = () => {
    getSocketById(clients[socket.id]).emit("opponentTimeOut", '1');
  }

  const randomFirstPlayer = () => {
    const player1Socket = socket
    const player2Socket = getSocketById(clients[player1Socket.id])

    const player1GoFirst = Math.random() > 0.5

    if ( player1GoFirst ){
      player1Socket.emit('setTurn', 3)
      player2Socket.emit('setTurn', 4)
    }
    else {
      player1Socket.emit('setTurn', 4)
      player2Socket.emit('setTurn', 3)
    }
  }

  return { sendShot, sendShips, sendOpponentTimeOut, randomFirstPlayer };
};

export default game;
