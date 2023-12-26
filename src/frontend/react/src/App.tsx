import "./App.css";
import Home from "./realPong/Home";
import { SocketProvider } from "./realPong/context/SocketContext";

function App() {
  return (
    // <div className="main-container">
    //   <GameProvider>
    //     <Pong />
    //   </GameProvider>
    // </div>
    <div>
      <SocketProvider>
        <Home />
      </SocketProvider>
    </div>
  );
}

export default App;
