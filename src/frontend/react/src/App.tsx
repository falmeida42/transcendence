import ChatPage from "./chat/ChatPage";
import Game from "./game/Game";
import "./App.scss"


function App() {
  return (
    <div className="app">
      <Game width={800} height={500} againstAi={false} />
      <ChatPage/>
    </div>
  );
}

export default App;
