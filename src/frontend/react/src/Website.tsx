import "./App.css";
import Game from "./game/Game.tsx";
import Bars from './Bars.tsx';
import { useHashStore } from "./hashStore.tsx";
import { useEffect } from 'react';
import Profile from "./Profile.tsx";
import Chat from "./Chat.tsx";
// import { useApi } from "./apiStore.tsx";
import ApiDataProvider from "./ApiDataProvider.tsx";
import { useApi } from "./apiStore.tsx";
import ApiData2faProvider from "./ApiData2faProvider.tsx";
import { Route, Switch } from "wouter";

function Website() {
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

	const {twofa, auth} = useApi();
	
  return (
	<div>
		<ApiData2faProvider/>
		<ApiDataProvider/>
		{(twofa === false || (twofa === true && auth === true)) && <Bars />}
			<Switch>
				<Route path="/Game">
				<div className="game">
					<Game width={800} height={500} againstAi={true}/>
				</div>
				</Route>
				<Route path="/Profile">
					<div className="game">
					<Profile/>
				</div>
				</Route>
				<Route path="/Chat">
					<div className="game">
					<Chat/>
				</div>
				</Route>
			</Switch>
	</div>
	);
}

export default Website;
