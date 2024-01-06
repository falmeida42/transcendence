import { KeyboardEventHandler, useContext, useState } from "react";
import { useApi } from '../../../apiStore';
import { ChatContext } from "../../context/ChatContext";

function validInput(str: string) {
   return str.length > 0;
}

const Input = (content: any) => {

  const [text, setText] = useState("");
  const [placeholder, setPlaceHolder] = useState("Type your message");
  const {login, image} = useApi();
  const {socket} = useContext(ChatContext) ?? {}

  console.log("CONTENT: ", JSON.stringify(content.content))

  const sendMessage = () => {
    if (validInput(text)) {
      console.log("This is the user content: ", login )
      console.log("props: ", content)
      console.log("props id: ", content.content.selectedChatData.id)
      socket.emit("messageToServer", { to: content.content.selectedChatData.id , message: text, sender: login , senderImage: image});
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