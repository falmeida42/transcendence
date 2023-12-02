import { currentUsername, socketIoRef } from "../../../network/SocketConnection";

interface MessageProps {
    username: string;
    text: string;
    imageContent: string;
}


const Message = (messageProps : MessageProps) => {
    console.log(`Message received: ${messageProps.text}`)
    return (
        <div className={`message ${messageProps.username === currentUsername && "owner"} `}>
            <div className="messageInfo">
                <img src={messageProps.imageContent} alt="" />
            </div>
            <div className="messageContent" >
                <p>{messageProps.text}</p>           
            </div>
        </div>
    )
}

export default Message