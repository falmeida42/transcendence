import { KeyboardEventHandler, useState } from "react";
import Play from "../../../assets/Play.png";
import { currentRoom, currentUsername, socketIoRef } from "../../../network/SocketConnection";

function validInput(str: string) {
   return str.length > 0;
}

const Input = () => {
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (validInput(text)) {
      socketIoRef.current.emit("messageToServer", { username: currentUsername, room: currentRoom, message: text });
      setText("");
    }
  };

  const handleKey: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  
  return (
    <div className="input">
      <input
        id="input"
        type="text"
        placeholder="Type something..."
        onKeyDown={handleKey}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="send">
        <img src={Play} alt="" />
        <button onClick={() => sendMessage()}>
          Send
        </button>
      </div>
    </div>
  );
};


export default Input;
