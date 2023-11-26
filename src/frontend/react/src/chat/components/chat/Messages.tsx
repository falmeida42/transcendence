import Message from "./Message";
import { useState, useEffect } from "react";
import { socketConnection } from "../../ChatPage";
import { v4 as uuid } from "uuid";

export interface MessageData {
  id: string;
  username: string;
  text: string;
}

export interface Payload {
  username: string;
  text: string;
}

const Messages = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);

  useEffect(() => {
    function receivedMessage(message: Payload) {
      const newMessage: MessageData = {
        id: "123",
        username: message.username,
        text: message.text,
      };

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
      {messages.map((message, index) => (
        <Message key={message.id} text={message.text} />
      ))}
    </div>
  );
};

export default Messages;
