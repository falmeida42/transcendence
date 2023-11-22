import { useState, useEffect } from "react";
import io from "socket.io-client";
import Play from "../../assets/Play.png";

const Input = () => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const socket = io("http://localhost:3000", {
    withCredentials: true,
    extraHeaders: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
    },
  });

  useEffect(() => {
    socket.on("message", (message) => {
      console.log("Received message:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const handleSend = () => {
    socket.emit("message", { data: text });
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
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Input;
