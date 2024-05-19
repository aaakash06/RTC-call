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
    wss.to(roomId).emit("simple-message", "hellow from the second pc");
    // wss.to(roomId).emit("send-offer", { roomId, from: ws.id });

    ws.on("offer", ({ from, offer }) => {
      console.log("got offer from pc1 and sending to pc2");
      wss.to(roomId).emit("offer", { roomId, from, offer });
    });
    ws.on("answer", ({ from, answer }) => {
      console.log("sent offer to pc2 and sending answer to pc1");
      wss.to(roomId).emit("answer", { roomId, from, answer });
      console.log("all sdp exchange done");
    });
    ws.on("negotiation", ({ offer }) => {
      wss.to(roomId).emit("negotiation", { roomId, offer });
    });
    ws.on("negotiation-final", ({ answer }) => {
      wss.to(roomId).emit("answer", { roomId, answer });
    });
    ws.on("negotiation-done", () => {
      console.log("all negotiation done");
    });
  });
});

server.listen(8000, () => {
  console.log("server is listening");
});
