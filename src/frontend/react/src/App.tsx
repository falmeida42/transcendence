import "./App.css";
import Game from "./game/Game";

function App() {
  return (
    <div className="game">
      <Game width={800} height={600} againstAi={false} />
    </div>
    // <div>
    //   <Test />
    // </div>
  );
}

export default App;
