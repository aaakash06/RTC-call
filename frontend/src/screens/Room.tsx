import React, { useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import Peer from "../utils/Peer";
import { useStream } from "../contexts/StreamContext";

const Room = () => {
  const localStream = useStream();
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoRefRemote = useRef<HTMLVideoElement>(null);

  const pathname = useParams();
  const socket = useSocket();
  // const [] = useState(null);

  const addHandler = useCallback(() => {
    socket!.on("room:joined", () => {
      console.log("room:joined");
    });

    const pc = new Peer();

    socket!.on("send-offer", () => {
      const offer = pc.getOffer();
      socket!.emit("offer", { from: socket?.id, offer });
    });

    socket!.on("offer", ({ offer }) => {
      const answer = pc.getAnswer(offer);
      socket!.emit("answer", { from: socket?.id, answer });
    });

    socket!.on("answer", ({ answer }) => {
      pc.setAnswer(answer);
    });
  }, [socket]);

  useEffect(() => {
    videoRef.current!.srcObject = localStream;
  }, []);

  useEffect(() => {
    socket?.emit("join:room", { roomId: pathname.roomid });
    addHandler();
  }, [socket, pathname.roomid, addHandler]);
  return (
    <>
      <h2 className="flex justify-center">Your roomId : {pathname.roomid}</h2>

      <div className="flex justify-between">
        <video autoPlay ref={videoRef}></video>
        <video autoPlay ref={videoRefRemote}></video>
      </div>
    </>
  );
};

export default Room;
