import { useContext, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import Message from "./Message";

export interface MessageData {
  id: string;
  username: string;
  userImage: string;
  message: string;
  type: boolean;
}

interface MessagesProps {
  chatId: string;
  chatName: string;
  chatImage: string;
}

const Messages = (props: MessagesProps) => {
  const { channelMessagesSelected } = useContext(ChatContext) ?? {};

  useEffect(() => {
    const elem = document.getElementById("chat-history");
    if (elem) {
      elem.scrollTop = elem.scrollHeight;
    }
  }, [channelMessagesSelected?.length]);

  return (
    <div className="chat-history" id="chat-history">
      {channelMessagesSelected?.map((message: any) => (
        <Message
          key={message.id}
          id={message.id}
          username={message.username}
          text={message.message}
          image={message.userImage}
          type={message.type}
          senderId={message.username}
        />
      ))}
    </div>
  );
};

export default Messages;
