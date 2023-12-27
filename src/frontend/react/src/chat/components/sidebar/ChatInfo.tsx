
interface ChatInfoProps {
    name: string;
    image: string;
}

const ChatInfo = (chatInfoProps: ChatInfoProps) => {
    console.log(`Chat information received: ${chatInfoProps.name}`)
    return(
        <div className="clearfix">
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