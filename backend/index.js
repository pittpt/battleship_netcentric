import game from "./controllers/game.js";
import client from "./controllers/client.js";
import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: ["http://124.120.118.80:4000"],
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

  socket.on("newGame", newSession);

  socket.on("ships", sendShips);

  socket.on("shot", sendShot);

  socket.on("end", terminateSession);

  socket.on("disconnect", removeClient);
});

io.listen(4000);
