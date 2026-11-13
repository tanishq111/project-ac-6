// helping the client communicate with the backend socket server (socket.io)
import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:3000", {
  cors: {
    origin: "http://127.0.0.1:3000",
    methods: ["GET", "POST"]
  }
});

export default socket;