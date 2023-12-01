import ChatPage from "./chat/ChatPage";
import Game from "./game/Game";
import "./App.scss"
import Form from "./Form";
import { Mapping } from "./network/SocketConnection";

function App() {
  return (
    <div className="app">
      <Mapping/>
      <Form/>
      <Game width={800} height={500} againstAi={false} />
      <ChatPage/>
    </div>
  );
}

export default App;
