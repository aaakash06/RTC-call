import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./screens/landing";
import Room from "./screens/Room";
import SocketContextProvider from "./contexts/SocketContext.tsx";

function App() {
  return (
    <BrowserRouter>
      <SocketContextProvider>
        <Routes>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/room/:roomid" element={<Room />}></Route>
        </Routes>
      </SocketContextProvider>
    </BrowserRouter>
  );
}

export default App;
