import game from "./controllers/game.js";
import client from "./controllers/client.js";
import { Server } from "socket.io";


const io = new Server({
  cors: {
    origin: ["http://localhost:4000"],
  },
});

const clients = {};

io.on("connection", (socket) => {
  const { sendShips, sendShot } = game(clients, socket, io);
  const { addClient, removeClient, newSession, terminateSession } = client(
    clients,
    socket,
    io
  );

  addClient();

  socket.on("newSession", newSession);
  socket.on("terminateSession", terminateSession);

  socket.on("sendShips", sendShips);
  socket.on("sendhot", sendShot);
  socket.on("disconnect", removeClient);
});

io.listen(4000);
