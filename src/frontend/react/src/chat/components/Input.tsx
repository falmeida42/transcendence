import { useState, useEffect } from "react";
import Play from "../../assets/Play.png";
import { socketConnection } from "../ChatPage";

const Input = () => {
  const [text, setText] = useState("");

  const sendSend = () => {
    socketConnection.emit("messageToServer", { message: text });
    setText("");
  };

  return (
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
  );
};

export default Input;
