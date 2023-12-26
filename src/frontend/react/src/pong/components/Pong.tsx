import { useContext } from "react";
import { Chat } from "./Chat";
import PlayerList from "./PlayerList";
import Rooms from "./Rooms";
import { GameContext, sendMessage } from "./contexts/gameContext";
import Game from "./Game";

const Pong = () => {
  const { isConnected, players, messages, match } = useContext(GameContext);

  return (
    <>
      {!isConnected && <div>Desconectado, conectando...</div>}
      {match.status && <Game />}

      {!match.status && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div className="list-container">
            <Rooms />
            <PlayerList players={players} />
          </div>
          <Chat sendMessage={sendMessage} messages={messages} />
        </div>
      )}
    </>
  );
};

export default Pong;
