
export interface ChatData {
  id: string
  name: string;
  image: string;
  type: string
}

interface ChatInfoProps {
    data: ChatData
    passSelectedChatData: (data: ChatData) => void;
}

const ChatInfo = (chatInfoProps: ChatInfoProps) => {

  const handleClick = () => {
    chatInfoProps.passSelectedChatData(chatInfoProps.data);
  }
  console.log(chatInfoProps.data.type)
    return(
        <div className="clearfix" onClick={handleClick}>
            <img src={chatInfoProps.data.image} alt="avatar" />
            <div className="about">
              <span>{chatInfoProps.data.name}</span>
              {chatInfoProps.data.type === "DIRECT_MESSAGE" && <div className="status">
                <i className="fa fa-circle online"></i> online
              </div>}
            </div>
          </div>
    );
};

export default ChatInfo