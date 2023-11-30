import Message from "./Message";
import { useState, useEffect } from "react";
import { socketConnection } from "../../ChatPage";

export interface MessageData {
  id: string;
  username: string;
  message: string;
}

export interface Payload {
  username: string;
  message: string;
}

const Messages = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);

  useEffect(() => {
    function receivedMessage(message: Payload) {
      const newMessage: MessageData = {
        id: crypto.randomUUID(),
        username: message.username,
        message: message.message,
      };

      console.log("real message: ", message)
      console.log("Message until set", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]); 
    }

    socketConnection.on("messageToClient", (message: Payload) => {
      console.log("Received message:", message);
      receivedMessage(message);
    });
    return () => {
      // Cleanup or disconnect logic (if needed)
    };
  }, []); // Removed messages and text from the dependency array to avoid unnecessary re-renders

  console.log("Current messages:", messages);

  return (
    <div className="messages">
      {messages.map((message) => (
        <Message key={message.id} text={message.message} />
      ))}
    </div>
  );
};

export default Messages;
