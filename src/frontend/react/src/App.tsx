import "./App.css";
import Game from "./game/Game";
import Bars from './Bars.tsx';
import { useHashStore } from "./hashStore.tsx";
import { useEffect } from 'react';
import Profile from "./Profile.tsx";
import Chat from "./Chat.tsx";
// import { useApi } from "./apiStore.tsx";
import ApiDataProvider from "./ApiDataProvider.tsx";

function App() {
	const { showHash } = useHashStore();
	useEffect(() => {

		const handleHashChange = () => {
			const hash = window.location.hash;
			useHashStore.getState().togglehash(hash);
		}
		window.addEventListener('hashchange', handleHashChange);

		return () => {
			window.removeEventListener('hashchange', handleHashChange);
		}
	}, []);
	
  return (
	<div>
		<ApiDataProvider/>
		<Bars />
			{showHash === '#Game' && (
			<div className="game">
				<Game width={800} height={500} againstAi={true}/>
			</div>)
			}
			{showHash === '#Profile' && (
			<div className="game">
				<Profile/>
			</div>)
			}
			{showHash === '#Chat' && (
			<div className="game">
				<Chat/>
			</div>)
			}
	</div>
	);
}

export default App;
