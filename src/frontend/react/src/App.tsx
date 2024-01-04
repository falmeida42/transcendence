import "./App.css";
import Game from "./game/Game";
import Bars from './Bars.tsx';
import { useHashStore } from "./hashStore.tsx";
import { useEffect } from 'react';
import Profile from "./Profile.tsx";
import Chat from "./Chat.tsx";
// import { useApi } from "./apiStore.tsx";
import ApiDataProvider from "./ApiDataProvider.tsx";
import ApiQr from "./ApiQr.tsx";
import { useApi } from "./apiStore.tsx";
import Api2fa from "./Api2fa.tsx";
import AuthApi from "./AuthApi.tsx";
import ApiData2faProvider from "./ApiData2faProvider.tsx";

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

	const {twofa, auth} = useApi();
	
  return (
	console.log(twofa, auth),
	<div>
		<ApiData2faProvider/>
		{(twofa === true && auth === false) && (<AuthApi code="" />)}
		
		{(twofa === false || (twofa === true && auth === true)) && <Bars />}
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
