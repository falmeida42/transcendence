import { useEffect, useState } from "react";
import io from "socket.io-client";

interface Message {
  id: string;
  name: string;
  text: string;
}

interface Payload {
  name: string;
  text: string;
}

const socket = io("http://localhost:3000/game", { withCredentials: true });

export const Test = () => {
  const [name, setName] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    function receivedMessage(message: Payload) {
      const newMessage: Message = {
        id: crypto.randomUUID(),
        name: message.name,
        text: message.text,
      };
      setMessages([...messages, newMessage]);
    }

    socket.on("msgToClient", (message: Payload) => {
      receivedMessage(message);
    });
  }, [messages, name, text]);

  function sendMessage() {
    const message: Payload = {
      name,
      text,
    };
    socket.emit("msgToServer", message);
    setText("");
  }

  return (
    <div>
      <ul>
        {messages.map((message) => {
          return (
            <li>
              <span>{message.name} diz:</span>
              <p>{message.text}</p>
            </li>
          );
        })}
      </ul>

      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        value={text}
        placeholder="Enter message..."
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
      />
      <button type="button" onClick={() => sendMessage()}>
        send
      </button>
    </div>
  );
};
