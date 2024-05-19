import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import Peer from "../utils/Peer";

const Room = () => {
  const pathname = useParams();
  const socket = useSocket();
  const [localStream, setLocalStream] = useState<null | MediaStream>(null);
  const [remoteStream, setRemoteStream] = useState<null | MediaStream>(null);
  const [pc, setPc] = useState<null | Peer>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoRefRemote = useRef<HTMLVideoElement>(null);

  const getStream = useCallback(async () => {
    const streams = await window.navigator.mediaDevices.getUserMedia({
      video: true,
      // audio: true,
    });
    videoRef.current!.srcObject = streams;
    setLocalStream(streams);
    return streams;
  }, []);

  const addHandler = useCallback(
    (pc: Peer) => {
      socket!.on("room:joined", async () => {
        console.log("room:joined");
      });
      socket!.on("simple-message", async (message) => {
        console.log(message);
      });

      // socket!.on("send-offer", async () => {
      //   console.log("pc2 wants offer");
      //   const offer = await pc.getOffer();
      //   socket!.emit("offer", { from: socket?.id, offer });
      // });

      // socket!.on("offer", async ({ offer }) => {
      //   console.log("pc1 sent offer");
      //   const answer = await pc.getAnswer(offer);
      //   socket!.emit("answer", { from: socket?.id, answer });
      // });

      // socket!.on("answer", async ({ answer }) => {
      //   console.log("pc2 sent answer");
      //   pc.setAnswer(answer);
      // });

      // pc.peer.addEventListener("negotiation-needed", () => {
      //   const offer = pc.getOffer();
      //   socket!.emit("negotiation", { offer });
      // });

      // socket?.on("negotiation", ({ offer }) => {
      //   const answer = pc.getAnswer(offer);
      //   socket!.emit("negotiation-final", { from: socket?.id, answer });
      // });
      // socket?.on("negotiation-final", ({ answer }) => {
      //   pc.setAnswer(answer);
      //   socket.emit("negotiation-done");
      // });

      // pc.peer.addEventListener("track", (e) => {
      //   const streams = e.streams;
      //   setRemoteStream(streams[0]);
      // });
    },
    [socket]
  );

  useEffect(() => {
    setPc(new Peer());
    getStream();
  }, []);

  useEffect(() => {
    socket?.emit("join:room", { roomId: pathname.roomid });
    addHandler(pc!);
  }, [pathname.roomid, socket]);

  return (
    <>
      <h2 className="flex justify-center">Your roomId : {pathname.roomid}</h2>

      <div className="flex justify-between">
        <video autoPlay ref={videoRef}></video>
        {remoteStream && <video autoPlay ref={videoRefRemote}></video>}
      </div>
      <div>
        <button
          onClick={() => {
            localStream;
            for (const track of localStream!.getTracks()) {
              pc?.peer.addTrack(track, localStream!);
            }
          }}
        >
          Call
        </button>
      </div>
    </>
  );
};

export default Room;
