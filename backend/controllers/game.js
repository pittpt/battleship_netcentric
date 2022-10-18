const game = (clients, socket, io) => {
   const getSocketById = (id) => io.sockets.sockets.get(id);

  const sendShot = (coordinate) => {
    getSocketById(clients[socket.id]).emit("sendShot", coordinate);
  };

  const sendShips = (ships) => {
    getSocketById(clients[socket.id]).emit("opponentShips", ships);
  };

  return { sendShot, sendShips };
};

export default game;
