import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Landing = () => {
  const [localStream, setLocalStream] = useState<null | MediaStream>(null);

  const getStream = useCallback(async () => {
    const streams = await window.navigator.mediaDevices.getUserMedia({
      video: true,
      // audio: true,
    });

    videoRef.current!.srcObject = streams;
    setLocalStream(streams);
  }, []);

  const [joinInput, setJoinInput] = useState("");
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const createAndJoin = useCallback(() => {
    const roomId = uuidv4();
    navigate(`/room/${roomId}`);
  }, []);

  useEffect(() => {
    getStream();
  }, []);

  return (
    <>
      <div className="flex justify-center">
        <video autoPlay ref={videoRef}></video>
      </div>
      <div className="my-20 flex justify-center font-extrabold text-2xl">
        <h1>Check Your Hair</h1>
      </div>

      <div className="mt-10 flex justify-center gap-10">
        <button
          onClick={() => {
            createAndJoin();
          }}
          className="border-2  px-5 rounded-md bg-slate-600  text-white "
        >
          Create and Join
        </button>
      </div>
      <div className="mt-10 flex justify-center gap-10">
        <div>
          <label htmlFor="roomInputt">Room Id: </label>
          <input
            className="text border-black border-2 pl-2"
            type="text"
            placeholder="room id"
            id="roomInputt"
            value={joinInput}
            onChange={(e) => {
              setJoinInput(e.target.value);
            }}
          />
        </div>

        <button
          onClick={() => {
            navigate(`/room/${joinInput.trim()}`);
          }}
          className="border-2  px-5 rounded-md bg-slate-600  text-white "
        >
          Join
        </button>
      </div>
    </>
  );
};

export default Landing;
