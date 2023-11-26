import "./App.css";
import Game from "./game/Game";

function App() {
  return (
    <div className="game">
      <Game
        width={window.innerWidth}
        height={window.innerHeight}
        againstAi={false}
      />
    </div>
  );
}

export default App;
