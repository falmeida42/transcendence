import "./App.css";
import Game from "./game/Game";
import Topbar from './Topbar.tsx'


function App() {
  return (
	  <div className="game">
		<Topbar />
      <Game width={800} height={500} againstAi={true} />
    </div>
  );
}

export default App;
