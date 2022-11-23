import game from "./controllers/game.js";
import client from "./controllers/client.js";
import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: ["http://localhost:4000"],
  },
});

const clients = {};
const clientNames = {};
const scores = {};
const boardStatus = {};

let resetScoreGlobal = () => {
  console.log("resetScore");
};

io.on("connection", (socket) => {
  const {
    sendShips,
    sendShot,
    addScore,
    randomPlayer,
    updateBoard,
    sendEmoji,
    resetScore,
  } = game(clients, socket, io, scores, clientNames, boardStatus);
  resetScoreGlobal = resetScore;
  const {
    addClient,
    removeClient,
    newSession,
    terminateSession,
    updateOverallPlayer,
  } = client(clients, socket, io, clientNames, scores);

  try {
    addClient();

    socket.on("newGame", newSession);

    socket.on("players", updateOverallPlayer);

    socket.on("ready", randomPlayer);

    socket.on("ships", sendShips);

    socket.on("shot", sendShot);

    socket.on("board", updateBoard);

    socket.on("win", addScore);

    socket.on("emoji", sendEmoji);

    socket.on("end", terminateSession);

    socket.on("disconnect", removeClient);
  } catch (error) {
    console.log(error);
  }
});

io.of("/admin").on("connection", (socket) => {
  const interval = setInterval(() => {
    socket.emit("admin", boardStatus, scores, clients, clientNames);
  }, 1000);

  socket.on("reset", () => {
    resetScoreGlobal(scores);
  });

  socket.on("disconnect", () => {
    clearInterval(interval);
  });
});

io.listen(4000);
