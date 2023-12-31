
interface ChatInfoProps {
    name: string;
    image: string;
    passSelectedChatData: (data: string) => void;
}

const ChatInfo = (chatInfoProps: ChatInfoProps) => {

  const handleClick = () => {
    chatInfoProps.passSelectedChatData(chatInfoProps.name);
  }

    return(
        <div className="clearfix" onClick={handleClick}>
            <img src={chatInfoProps.image} alt="avatar" />
            <div className="about">
              <span>{chatInfoProps.name}</span>
              <div className="status">
                <i className="fa fa-circle online"></i> online
              </div>
            </div>
          </div>
    );
};

export default ChatInfo