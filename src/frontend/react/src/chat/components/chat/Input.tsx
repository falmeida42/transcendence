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

    <div className="chat-message clearfix">
    <textarea 
        name="message-to-send" 
        id="message-to-send" 
        placeholder ="Type your message" 
        value={text}
        onChange={(e) => setText(e.target.value)}
        ></textarea>
           
    <i className="fa fa-file-o"></i> &nbsp;&nbsp;&nbsp;
    <i className="fa fa-file-image-o"></i>

    <button onClick={() => sendMessage()}>Send</button>
    </div>  
  );
};


export default Input;
