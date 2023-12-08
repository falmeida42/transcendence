import "./App.css";
import Game from "./game/Game";
import Topbar from './Topbar.tsx';
import Sidebar from "./Sidebar";


function App() {
  return (
	  <div>
		<Sidebar/>
		<Topbar />
		<div className="game">
   			<Game width={800} height={500} againstAi={true} />

		</div>
	  </div>
	);
}

export default App;
