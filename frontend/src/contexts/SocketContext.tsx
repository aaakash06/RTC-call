import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export default function SocketContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const URL = "localhost:8000";

  const [socket, setSocket] = useState<Socket | null>(null);
  const connectToWSS = useCallback(async () => {
    const socket = await io(URL);
    // console.log(socket);
    setSocket(socket);
  }, []);
  useEffect(() => {
    connectToWSS();
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
