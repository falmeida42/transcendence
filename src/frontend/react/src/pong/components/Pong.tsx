import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { Chat } from "./Chat";
import PlayerList, { player } from "./PlayerList";

let socket: Socket;
const Pong = () => {
  const [players, setPlayers] = useState<{ [index: string]: player }>({});

  useEffect(() => {
    socket = io("http://localhost:3000/game");
    socket.on("connect", () => {
      console.log("Conectado!");
    });

    socket.on("PlayerUpdate", (players) => {
      setPlayers(players);
    });
  }, []);

  const sendMessage = (message: string) => {
    socket.emit("sendMessage", { message });
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <PlayerList players={players} />
      <Chat sendMessage={sendMessage} />
    </div>
  );
};

export default Pong;
