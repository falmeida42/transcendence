import { socketIoRef } from "../../../network/SocketConnection";
import { ChatContext, tk,  } from "../../context/ChatContext";
import Message from "./Message";
import { useState, useEffect, useContext } from "react";

export interface MessageData {
  id: string;
  username: string;
  userImage: string;
  message: string;
}


interface MessagesProps {
  chatId: string;
  chatName: string;
  chatImage: string
}


const Messages = (props: MessagesProps) => {
  const [messages, setMessages] = useState<MessageData[]>([]);

  console.log("ID  ",props.chatId)

  useEffect(() => {
    fetch(`http://localhost:3000/user/chatHistory/${props.chatId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tk}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.text();
        return data ? JSON.parse(data) : null;
      })
      .then((data) => {
        if (data) {
          console.log("Daaaata received ", data);
          
          setMessages(data.map( (message): MessageData => ({
            id: message.id,
            username: message.sender.login,
            userImage: message.sender.image,
            message: message.content
            })
          ))
        } else {
          console.log("No data received");
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, [props.chatId]);

  console.log("Current messages:", messages);

  return (
    <div className="chat-history">
      {messages.map((message) => (
        <Message key={message.id} username={message.username} text={message.message} image={message.userImage}/>
      ))}
    </div>
  );
};

export default Messages;
