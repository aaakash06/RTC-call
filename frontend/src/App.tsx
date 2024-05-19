import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./screens/landing";
import Room from "./screens/Room";
import SocketContextProvider from "./contexts/SocketContext.tsx";
import StreamContextProvider from "./contexts/StreamContext.tsx";
function App() {
  return (
    <BrowserRouter>
      <StreamContextProvider>
        <SocketContextProvider>
          <Routes>
            <Route path="/" element={<Landing />}></Route>
            <Route path="/room/:roomid" element={<Room />}></Route>
          </Routes>
        </SocketContextProvider>
      </StreamContextProvider>
    </BrowserRouter>
  );
}

export default App;
