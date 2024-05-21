import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import Peer from "peerjs";
import ReactPlayer from "react-player";

const Room = () => {
  // console.log("rendered");
  const pathname = useParams();
  const socket = useSocket();
  const [localStream, setLocalStream] = useState<null | MediaStream>(null);
  const [remoteStream, setRemoteStream] = useState<null | MediaStream>(null);

  // const [peer, setPeer] = useState(null);

  // const [called, setCalled] = useState(false);

  const addHandler = useCallback((pc: Peer) => {
    socket!.on("user-connected", ({ userId }) => {
      pc.on("connection", function (conn) {
        console.log(
          "connection for message established, frist person stuck his hands"
        );
        // console.log(new Date().getSeconds.toString());
        conn.on("data", (data) => {
          console.log("data : " + data);
        });
      });
      pc.on("error", console.error);
      setTimeout(() => {
        const conn = pc.connect(userId);
        // conn.on("error", console.error);
        conn.on("open", () => {
          // console.log(new Date().getSeconds.toString());
          console.log("connection after open: ", conn);
          conn.send("hello from the first user");
        });
      }, 1000);

      console.log("second user connected with peerId: " + userId);
    });
  }, []);

  const connectToPeerServer = useCallback(async () => {
    const pc = new Peer(undefined, { host: "/", port: "3001" });

    pc?.on("open", (id) => {
      console.log("peer connection established");
      console.log("my peer id: " + id);
      addHandler(pc);
      socket?.emit("join:room", { roomId: pathname.roomid, userId: id });
    });
  }, [pathname.roomid, socket, addHandler]);

  useEffect(() => {
    if (!localStream) return;
    connectToPeerServer();
  }, [localStream, connectToPeerServer]);

  useEffect(() => {
    // effectFunction();
    window.navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((streams) => {
        setLocalStream(streams);
      });
  }, []);

  return (
    <>
      <h2 className="flex justify-center">Your roomId : {pathname.roomid}</h2>

      <div className="flex justify-between">
        {/* <video autoPlay ref={videoRef}></video> */}
        {localStream && (
          <ReactPlayer
            playing
            muted
            height="500px"
            width="400px"
            url={localStream!}
          />
        )}

        {remoteStream && (
          <ReactPlayer
            playing
            height="500px"
            width="400px"
            url={remoteStream}
          />
        )}
      </div>

      <div className="mt-20 flex justify-center">
        <button onClick={() => {}}>Call</button>
      </div>
    </>
  );
};

export default Room;
