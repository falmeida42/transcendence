import { useState, useEffect } from "react";
import io from "socket.io-client";
import Play from "../../assets/Play.png";

interface Message {
  name: string;
  text: string;
}

interface Payload {
  name: string;
  text: string;
}

const Input = () => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const socket = io("http://localhost:3000/chat", {
    withCredentials: true
  });

  useEffect(() => {

    function receivedMessage(message: Payload) {
      const newMessage: Message = {
        name: message.name,
        text: message.text
      };

      setMessages([... messages, newMessage])
    }

    socket.on("messageToClient", (message: Payload) => {
      console.log("Received message:", message);
      receivedMessage(message)
    });

    return () => {
      socket.disconnect();
    };
  }, [messages, text]);

  const sendSend = () => {
    socket.emit("messageToServer", { message: text });
    setText("");
  };

  return (
    <div>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message.data}</li>
        ))}
      </ul>

      <div className="input">
        <input
          id="message"
          type="text"
          placeholder="Type something..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="send">
          <img src={Play} alt="" />
          <button onClick={() => sendSend()}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Input;
