import { useContext } from "react";
import { Chat } from "./Chat";
import PlayerList from "./PlayerList";
import { GameContext, sendMessage } from "./contexts/gameContext";

const Pong = () => {
  const { isConnected, players, messages } = useContext(GameContext);

  return (
    <>
      {!isConnected && <div>Desconectado, conectando...</div>}
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <PlayerList players={players} />
          <Chat sendMessage={sendMessage} messages={messages} />
        </div>
      </div>
    </>
  );
};

export default Pong;
