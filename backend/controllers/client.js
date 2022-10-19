import { clientKey } from "../helpers/index.js";

const client = (clients, socket, io) => {
  const getSocketById = (id) => io.sockets.sockets.get(id);

  const addClient = (avoidOpponent) => {
    const key = clientKey(clients);
    for (let i = 0; i < key.length; i++) {
      const otherSocketId = key[i];
      const otherSocketOpponent = clients[otherSocketId];
      if (!otherSocketOpponent && otherSocketId !== avoidOpponent) {
        clients[otherSocketId] = socket.id;
        clients[socket.id] = otherSocketId;
        i = key.length;
        getSocketById(otherSocketId).emit("opponent", socket.id);
      }
    }
    const key2 = clientKey(clients);
    if (!key2.includes(socket.id)) {
      clients[socket.id] = null;
    }
    //important
    socket.emit("opponent", clients[socket.id]);
  };

  const removeClient = () => {
    const otherSocketId = clients[socket.id];
    if (otherSocketId) {
      clients[otherSocketId] = null;
      getSocketById(otherSocketId).emit("opponent", null);
    }
    delete clients[socket.id];
  };

  const newSession = () => {
    const opponent = clients[socket.id];
    removeClient();
    addClient(opponent);
  };

  const terminateSession = (position) => {
    getSocketById(clients[socket.id]).emit("terminateSession", position);
  };

  return { addClient, removeClient, newSession, terminateSession };
};

export default client;
