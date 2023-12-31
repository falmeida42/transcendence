import { KeyboardEventHandler, useState } from "react";
import { currentRoom, currentUsername, socketIoRef } from "../../../network/SocketConnection";
import { useApi } from '../../../apiStore';

function validInput(str: string) {
   return str.length > 0;
}

const Input = () => {
  const [text, setText] = useState("");
  const [placeholder, setPlaceHolder] = useState("Type your message");
  const {user} = useApi();

  const sendMessage = () => {
    if (validInput(text)) {
      socketIoRef.current.emit("messageToServer", { username: user, message: text });
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

    <button onClick={() => sendMessage()}> <i className="fa fa-paper-plane clickable" style={{color: "grey"}}></i></button>
    </div>  
  );
};


export default Input;