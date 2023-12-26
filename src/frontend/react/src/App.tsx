import "./App.css";
import Pong from "./pong/components/Pong";
import { GameProvider } from "./pong/components/contexts/gameContext";

function App() {
  return (
    // <div className="game">
    //   <Game width={800} height={600} againstAi={false} />
    // </div>
    <div className="main-container">
      <GameProvider>
        <Pong />
      </GameProvider>
    </div>
  );
}

export default App;
