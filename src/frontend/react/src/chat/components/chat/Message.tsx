import { socketIoRef } from "../../../network/SocketConnection";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { useApi } from "../../../apiStore";


interface MessageProps {
    username: string;
    text: string;
}


const Message = (messageProps : MessageProps) => {

    const { login } = useApi();

    console.log(`Message received: ${messageProps.text}`)
    console.log( "username: ", login)
    
    
    return (
        <div className={`message ${messageProps.username === login ? "other-message float-right" : "my-message "}`}>
                {messageProps.text}     
        </div>
    )
}

export default Message