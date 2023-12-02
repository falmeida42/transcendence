
interface ChatInfoProps {
    name: string;
    image: string;
}

const ChatInfo = (chatInfoProps: ChatInfoProps) => {
    console.log(`Chat information received: ${chatInfoProps.name}`)
    return(
        <div className="userChat">
            <img src={chatInfoProps.image} alt=""></img>
            <div className="userChatInfo">
                <span>{chatInfoProps.name}</span>
            </div>
        </div>
    );
};

export default ChatInfo