import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const StreamContext = createContext<null | MediaStream>(null);

export const useStream = () => {
  const stream = useContext(StreamContext);
  return stream;
};

export default function StreamContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const getStream = useCallback(async () => {
    const streams = await window.navigator.mediaDevices.getUserMedia({
      video: true,
      // audio: true,
    });
    setLocalStream(streams);
  }, []);

  // const videoTrack = streams.getVideoTracks()[0];
  // const audioTrack = streams.getAudioTracks()[0];
  // videoRef.current!.srcObject = streams;
  // videoRef.current!.play();

  useEffect(() => {
    getStream();
  }, []);

  return (
    <StreamContext.Provider value={localStream}>
      {children}
    </StreamContext.Provider>
  );
}
