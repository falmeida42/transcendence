import "./App.css";
import Game from "./game/Game";
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
  return (
    <div className="game">
      <Mapping/>
      <Game width={800} height={500} againstAi={false} />
    </div>
  );
}

export default App;
