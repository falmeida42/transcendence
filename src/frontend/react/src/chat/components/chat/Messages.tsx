import { socketIoRef } from "../../../network/SocketConnection";
import Message from "./Message";
import { useState, useEffect } from "react";

export interface MessageData {
  id: string;
  username: string;
  userImage: string;
  message: string;
}

export interface Payload {
  username: string;
  userImage: string
  message: string;
}

function fetchMessageData(setMessages: React.Dispatch<React.SetStateAction<MessageData[]>>) {
  socketIoRef.current.on("messageToClient", (message: Payload) => {
    console.log("Received message:", message);
    receivedMessage(message, setMessages);
  })
  
};

function receivedMessage(message: Payload, setMessages: React.Dispatch<React.SetStateAction<MessageData[]>>) {
  const newMessage: MessageData = {
    id: crypto.randomUUID(),
    username: message.username,
    userImage: message.userImage,
    message: message.message,
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
        <Message key={message.id} username={message.username} text={message.message}/>
      ))}
    </div>
  );
};

export default Messages;
