import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { Chat } from "./Chat";
import PlayerList, { player } from "./PlayerList";

let socket: Socket;
const Pong = () => {
  const [players, setPlayers] = useState<{ [index: string]: player }>({});
  const [messages, setMessages] = useState("");

  useEffect(() => {
    socket = io("http://localhost:3000/game");
    socket.on("connect", () => {
      console.log("Conectado!");
    });
  }, []);

  useEffect(() => {
    socket.on("PlayerUpdate", (players) => {
      setPlayers(players);
    });
  }, [players]);
  useEffect(() => {
    socket.on("receiveMessage", (msg: string) => {
      setMessages(messages + msg);
    });
  }, [messages]);

  const sendMessage = (message: string) => {
    socket.emit("sendMessage", { message });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PlayerList players={players} />
      <Chat sendMessage={sendMessage} messages={messages} />
    </div>
  );
};

export default Pong;
