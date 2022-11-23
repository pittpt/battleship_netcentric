import io from "socket.io-client";
import { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";

const socket = io("localhost:4000/admin", { transports: ["websocket"] });
const useAdmin = () => {
  const { addToast } = useToasts();
  const [adminSyncState, setAdminSyncState] = useState({
    boardStatus: null,
    scores: null,
    clients: null,
    clientNames: null,
  });
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected to server");
    });

    socket.on("admin", (boardStatus, scores, clients, clientNames) => {
      console.log("admin", boardStatus, scores, clients, clientNames);
      setAdminSyncState({ boardStatus, scores, clients, clientNames });
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  const reset = () => {
    socket.emit("reset");
    addToast("Game reseted", { appearance: "success" });
  };

  return {
    adminSyncState,
    reset,
  };
};

export default useAdmin;
