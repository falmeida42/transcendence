import Message from "./Message";
import { useState, useEffect } from "react";
import { socketConnection } from "../ChatPage";

export interface MessageData {
  name: string;
  text: string;
}

interface Payload {
  name: string;
  text: string;
}

const Messages = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);

  useEffect(() => {
    function receivedMessage(message: Payload) {
      const newMessage: MessageData = {
        name: message.name,
        text: message.text,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }

    socketConnection.on("messageToClient", (message: Payload) => {
      console.log("Received message:", message);
      receivedMessage(message);
    });

    return () => {
      // Clean up socket event listeners if needed
    };
  }, []); // Removed messages and text from the dependency array to avoid unnecessary re-renders

  return (
    <div className="messages">
      {messages.map((message, index) => (
        <Message key={index} text={message.text} />
      ))}
    </div>
  );
};

export default Messages;
