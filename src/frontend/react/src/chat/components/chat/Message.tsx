import { socketIoRef } from "../../../network/SocketConnection";

interface MessageProps {
    text: string;
    imageContent: string;
    socketId: string;
}


const Message = (messageProps : MessageProps) => {
    console.log(`Message received: ${messageProps.text}`)
    return (
        <div className={`message ${messageProps.socketId === socketIoRef.current.socketId && "owner"} `}>
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