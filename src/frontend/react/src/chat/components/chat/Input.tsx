import { KeyboardEventHandler, useState } from "react";
import Play from "../../../assets/Play.png";
import { currentRoom, currentUsername, socketIoRef } from "../../../network/SocketConnection";

function validInput(str: string) {
   return str.length > 0;
}

const Input = () => {
  const [text, setText] = useState("");
  const [placeholder, setPlaceHolder] = useState("Type your message");

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
        placeholder ={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onClick={() => setPlaceHolder("")}
        onBlur={() => setPlaceHolder("Type your message")}
        ></textarea>
           
    <i className="fa fa-ban clickable" style={{marginRight: "10px"}}></i>
    <i className="fa fa-gamepad clickable"></i>

    <button onClick={() => sendMessage()}>Send</button>
    </div>  
  );
};


export default Input;