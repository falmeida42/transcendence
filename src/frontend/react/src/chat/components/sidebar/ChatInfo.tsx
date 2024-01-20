import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

export interface ChatData {
  id: string;
  name: string;
  image: string;
  type: string;
  status: number;
}

interface ChatInfoProps {
  data: ChatData;
  passSelectedChatData: (data: ChatData) => void;
}

const ChatInfo = (chatInfoProps: ChatInfoProps) => {
  const { setChannelSelected } = useContext(ChatContext) ?? {};

  const onlineStatus = (() => {
    switch (chatInfoProps.data.status) {
      case 1:
        return "online";
      case 2:
        return "in-game";
      default:
        return "offline";
    }
  })();

  const handleClick = () => {
    if (setChannelSelected) setChannelSelected(chatInfoProps.data.id);
    chatInfoProps.passSelectedChatData(chatInfoProps.data);
  };

  return (
    <div className="clearfix" onClick={handleClick}>
      <img src={chatInfoProps.data.image} alt="avatar" />
      <div className="about">
        <span>{chatInfoProps.data.name}</span>
        {chatInfoProps.data.type === "DIRECT_MESSAGE" && (
          <div className="status">
            <i className={`fa fa-circle ${onlineStatus}`}> {onlineStatus}</i>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInfo;
