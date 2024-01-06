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
  const {channelMessagesSelected} = useContext(ChatContext) ?? {}
  

  console.log("Current messages:", JSON.stringify(channelMessagesSelected));

  return (
    <div className="chat-history">
      {channelMessagesSelected?.map((message : any ) => (
        <Message key={message.id} username={message.username} text={message.message} image={message.userImage}/>
      ))}
    </div>
  );
};

export default Messages;
