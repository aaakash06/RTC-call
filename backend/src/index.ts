import { Server } from "socket.io";
const express = require("express");
import { createServer } from "http";

const server = createServer(express());

const wss = new Server(server, {
  cors: {
    origin: "*",
  },
});

wss.on("connection", (ws) => {
  // console.log("websocket created");
  console.log(ws.id);

  ws.on("join:room", ({ roomId }) => {
    ws.join(roomId);
    console.log(ws.id, " joined the room : ", roomId);

    wss.to(roomId).emit("send-offer", { roomId, from: ws.id });

    ws.on("offer", ({ from, offer }) => {
      wss.to(roomId).emit("offer", { roomId, from, offer });
    });
    ws.on("answer", ({ from, answer }) => {
      wss.to(roomId).emit("answer", { roomId, from, answer });
    });
  });
});

server.listen(8000, () => {
  console.log("server is listening");
});
