import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useStream } from "../contexts/StreamContext";

const Landing = () => {
  const stream = useStream();

  const [joinInput, setJoinInput] = useState("");
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const createAndJoin = useCallback(() => {
    const roomId = uuidv4();
    navigate(`/room/${roomId}`);
  }, []);

  useEffect(() => {
    videoRef.current!.srcObject = stream;
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
        <div>
          <label htmlFor="roomInput">Room Id: </label>
          <input
            className="text border-black border-2 pl-2"
            type="text"
            placeholder="room id"
            id="roomInput"
          />
        </div>

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
            navigate(`/room/${joinInput}`);
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
