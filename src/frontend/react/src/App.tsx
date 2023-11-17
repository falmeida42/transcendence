import "./App.css";
import Game from "./game/Game";

function App() {
  return (
    <div className="game">
      <Game width={1080} height={720} />
    </div>
  );
}

export default App;
