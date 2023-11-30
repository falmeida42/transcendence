import Message from "./Message";
import { useState, useEffect } from "react";
import { socketConnection } from "../../../network/SocketConnection";

export interface MessageData {
  id: string;
  username: string;
  userImage: string;
  message: string;
  socketId: string
}

export interface Payload {
  username: string;
  userImage: string
  message: string;
}

function fetchMessageData(setMessages: React.Dispatch<React.SetStateAction<MessageData[]>>) {
  socketConnection.on("messageToClient", (message: Payload, socketId: string) => {
    console.log("Received message:", message);
    receivedMessage(message, socketId, setMessages);
  })
  
};

function receivedMessage(message: Payload, socketId: string, setMessages: React.Dispatch<React.SetStateAction<MessageData[]>>) {
  const newMessage: MessageData = {
    id: crypto.randomUUID(),
    username: message.username,
    userImage: message.userImage,
    message: message.message,
    socketId: socketId
  };

  console.log("Message until set", newMessage);
  setMessages((prevMessages) => [...prevMessages, newMessage]); 
}

const Messages = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);

  useEffect(() => {
    

    fetchMessageData(setMessages)
    return () => {
      // Cleanup or disconnect logic (if needed)
    };
  }, []); // Removed messages and text from the dependency arrx\ay to avoid unnecessary re-renders

  console.log("Current messages:", messages);

  return (
    <div className="messages">
      {messages.map((message) => (
        <Message key={message.id} text={message.message} imageContent={message.userImage} socketId={message.socketId}/>
      ))}
    </div>
  );
};

export default Messages;
