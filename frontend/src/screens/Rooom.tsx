import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import Peer from "../utils/Peer";
import ReactPlayer from "react-player";

const Room = () => {
  // console.log("rendered");
  const pathname = useParams();
  const socket = useSocket();
  const [localStream, setLocalStream] = useState<null | MediaStream>(null);
  const [remoteStream, setRemoteStream] = useState<null | MediaStream>(null);
  // const remoteStreamRef = useRef(new MediaStream());
  const [pc, setpc] = useState<null | Peer>(null);

  // useEffect(() => {
  //   if (!remoteStream) {
  //     return console.log("no remoteStream");
  //   }
  //   console.log("remoteStream: ", remoteStream);
  // }, [remoteStream]);

  useEffect(() => {
    if (!pc) return;
    // console.log("we got our pc");
    // console.log(pc);
    pc.peer.addEventListener("negotiationneeded", async () => {
      console.log("negotiation need");
      const offer = await pc.getOffer();
      socket?.emit("offer", { offer });
    });

    pc.peer.addEventListener("track", (event) => {
      console.log("tracks are coming: ", event.streams[0]);
      // remoteStreamRef.current.addTrack(event.track);
      setRemoteStream(event.streams[0]);
      console.log("remote stream:", remoteStream);
    });

    // addHandler();
    // console.log("lets add handlers");
    socket?.on("user-connected", async () => {
      console.log("second user connected ");

      // console.log("pc: ", pc);
      const offer = await pc?.getOffer();
      // console.log("offer we sending: ", offer);
      // console.log(socket);
      socket.emit("offer", { offer });
      // pc?.getOffer().then((offer) => {
      //   console.log("offer we sending: ", offer);
      //   socket.emit("offer", {offer});
      // });
    });

    socket?.on("offer", ({ offer }) => {
      console.log("offer reached 2nd user:", offer);
      pc?.getAnswer(offer).then((answer) => {
        socket?.emit("answer", { answer });
      });
    });

    socket?.on("answer", ({ answer }) => {
      console.log("answer reached 1st user: ", answer);
      pc?.setAnswer(answer);
    });

    ////////
    socket?.emit("join:room", { roomId: pathname.roomid });
  }, [pc, socket, pathname.roomid]);

  useEffect(() => {
    if (!localStream) return;
    setpc(new Peer());
  }, [localStream]);

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
      </div>

      <div className="mt-20 flex justify-center">
        <button
          onClick={() => {
            const tracks = localStream?.getTracks();
            console.log("started adding/sending tracks", tracks);
            for (const track of tracks!) {
              pc?.peer.addTrack(track, localStream!);
            }
          }}
        >
          Call
        </button>
      </div>

      {remoteStream && (
        <div className="absolute b-0">
          {" "}
          <h1>RemoteStream Acquired</h1>{" "}
          <ReactPlayer
            playing
            height="500px"
            width="400px"
            url={remoteStream}
          />{" "}
        </div>
      )}
    </>
  );
};

export default Room;
