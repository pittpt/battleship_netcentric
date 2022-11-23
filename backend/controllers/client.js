import { clientKey } from "../helpers/index.js";

const client = (clients, socket, io, clientNames, scores) => {
  const getSocketById = (id) => io.sockets.sockets.get(id);

  const addClient = (avoidOpponent) => {
    updateOverallPlayer();
    const key = clientKey(clients);
    for (let i = 0; i < key.length; i++) {
      const otherSocketId = key[i];
      const otherSocketOpponent = clients[otherSocketId];
      if (!otherSocketOpponent && otherSocketId !== avoidOpponent) {
        clients[otherSocketId] = socket.id;
        clients[socket.id] = otherSocketId;
        i = key.length;
        getSocketById(otherSocketId).emit(
          "opponent",
          socket.id,
          clientNames[socket.id],
          (scores[socket.id] ?? 0).toString()
        );
      }
    }
    const key2 = clientKey(clients);
    if (!key2.includes(socket.id)) {
      clients[socket.id] = null;
    }
    //important
    socket.emit(
      "opponent",
      clients[socket.id],
      clientNames[clients[socket.id]],
      (scores[clients[socket.id]] ?? 0).toString()
    );
  };

  const removeClient = () => {
    const otherSocketId = clients[socket.id];
    if (otherSocketId) {
      clients[otherSocketId] = null;
      getSocketById(otherSocketId).emit("opponent", null);
    }
    delete clients[socket.id];
  };

  const newSession = ({ name }) => {
    const opponent = clients[socket.id];
    clientNames[socket.id] = name;
    updateOverallPlayer();
    removeClient();
    // addClient();
    addClient(opponent);
  };

  const updateOverallPlayer = () => {
    const overallPlayerNames = Object.values(clientNames);
    io.sockets.emit("updateOverallPlayer", overallPlayerNames);
  };

  const terminateSession = (position) => {
    getSocketById(clients[socket.id]).emit("end", position);
  };

  return {
    addClient,
    removeClient,
    newSession,
    terminateSession,
    updateOverallPlayer,
  };
};

export default client;
