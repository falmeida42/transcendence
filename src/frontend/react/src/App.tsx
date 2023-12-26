import "./App.css";
import Game from "./game/Game";
import Bars from './Bars.tsx';
import { useHashStore } from "./hashStore.tsx";
import { useEffect } from 'react';
import Profile from "./Profile.tsx";
import Chat from "./Chat.tsx";

import { useEffect } from "react";

export var token: string | null;

export const Mapping: React.FunctionComponent = () => {

    useEffect(() => {

      const urlParams = new URLSearchParams(window.location.search);
      token = urlParams.get('token');

      console.log("Frontend: token", token);

      // handleFetchData();
      fetch('http://localhost:3000/user/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type`': 'application/json',
        }
      })
        .then(async (response) => await response.json())
        .then((data) => console.log(data))
        .catch((error) => console.log(error))

    }, []);

  return <div>Transcendence</div>;
}

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
