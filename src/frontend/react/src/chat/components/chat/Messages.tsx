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

  messages.push(
    {
      id: crypto.randomUUID(),
      username: "falmeida",
      userImage: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01.jpg",
      message: "Hello hello hello hello aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    }
  )

  messages.push(
    {
      id: crypto.randomUUID(),
      username: "falmeidaa",
      userImage: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_10.jpg",
      message: "World"
    }
  )

  messages.push(
    {
      id: crypto.randomUUID(),
      username: "falmeida",
      userImage: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01.jpg",
      message: "Hello"
    }
  )

  messages.push(
    {
      id: crypto.randomUUID(),
      username: "falmeidaa",
      userImage: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_10.jpg",
      message: "World"
    }
  )
  
  console.log("Current messages:", messages);

  return (
    <div className="chat-history">
      {messages.map((message) => (
        <Message key={message.id} username={message.username} text={message.message}/>
      ))}
    </div>
  );
};

export default Messages;
