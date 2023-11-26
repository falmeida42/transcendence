import { useState } from "react";
import Play from "../../assets/Play.png";
import { socketConnection } from "../../ChatPage";

function validInput(str: string) {
   return str.length > 0;
}

const Input = () => {
  const [text, setText] = useState("");

  const sendSend = () => {
    if (validInput(text)) {
      socketConnection.emit("messageToServer", { username: "falmeida", message: text });
      setText("");
    }
  };

  return (
    <div className="input">
      <input
        id="input"
        type="text"
        placeholder="Type something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="send">
        <img src={Play} alt="" />
        <button onClick={() => sendSend()}>
          Send
        </button>
      </div>
    </div>
  );
};


export default Input;
