import ChatPage from "./chat/ChatPage";
import Game from "./game/Game";
import {Connection} from "./network/SocketConnection"


function App() {
  return (
    <div className="game">
      <Connection/>
      <Game width={800} height={500} againstAi={false} />
      <ChatPage/>
    </div>
  );
}

export default App;
