import clientsHelperFunctionGenerator from "./helpers/index.js";
import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: ["http://localhost:3000"],
  },
});

const clients = {};

io.on("connection", (socket) => {
  const { addClient, removeClient, newGame, sendShips, shot, end } =
    clientsHelperFunctionGenerator(clients, socket, io);

  addClient();

  socket.on("newGame", newGame);

  socket.on("ships", sendShips);

  socket.on("shot", shot);

  socket.on("end", end);

  socket.on("disconnect", removeClient);
});

io.listen(3001);
