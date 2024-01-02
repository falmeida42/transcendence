import { KeyboardEventHandler, useContext, useState } from "react";
import { useApi } from '../../../apiStore';
import { ChatContext } from "../../context/ChatContext";

function validInput(str: string) {
   return str.length > 0;
}

const Input = (content: any) => {


  const [text, setText] = useState("");
  const [placeholder, setPlaceHolder] = useState("Type your message");
  const {login} = useApi();
  const {socket} = useContext(ChatContext) ?? {}



  const sendMessage = () => {
    if (validInput(text)) {
      console.log("This is the input content: ", content.content.selectedChatData )
      console.log("This is the user content: ", login )
      socket.emit("messageToServer", { to: login , message: text, sender: content.content.selectedChatData });
      setText("");
    }
  };

  const handleKey: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
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