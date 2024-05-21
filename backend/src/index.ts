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
  let roomId = "";
  ws.on("join:room", ({ roomId: roomid }) => {
    ws.join(roomid);
    roomId = roomid;
    console.log(ws.id, " joined the room : ", roomId);
    ws.broadcast.to(roomId).emit("user-connected");
    // wss.to(roomId).emit("send-offer", { roomId, from: ws.id });
  });

  ws.on("offer", ({ offer }) => {
    console.log("got offer from pc1 and sending to pc2  ");
    ws.broadcast.to(roomId).emit("offer", { offer });
  });
  ws.on("answer", ({ answer }) => {
    console.log("sent offer to pc2 and sending answer to pc1");
    ws.broadcast.to(roomId).emit("answer", { answer });
    // console.log("all sdp exchange done");
  });

  // ws.on("negotiation", ({ offer }) => {
  //   wss.to(roomId).emit("offer", {offer });
  // });
  // ws.on("", ({ answer }) => {
  //   wss.to(roomId).emit("answer", {answer });
  // });
});

server.listen(8000, () => {
  console.log("server is listening");
});
