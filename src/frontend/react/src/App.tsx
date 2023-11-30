import "./App.css";
import ChatPage from "./chat/ChatPage";
import Game from "./game/Game";

function App() {
  return (
    <div>
      <Game width={800} height={500} againstAi={false} />
      <ChatPage/>
    </div>
  );
}

export default App;
