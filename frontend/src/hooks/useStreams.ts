import { useMemo } from "react";

export const useStream = async () => {
  const streams = await useMemo(async () => {
    const streams = await window.navigator.mediaDevices.getUserMedia({
      video: true,
      // audio: true,
    });

    // videoRef.current!.srcObject = streams;
    return streams;
  }, []);

  return streams;
};
