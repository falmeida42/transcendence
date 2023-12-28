import Mute from "../../../assets/Mute.png"
import Block from "../../../assets/Block.png"
import Messages from "./Messages"
import Input from "./Input"

export const toggleChatVisibility = () => {
    const element = (document.getElementById("chat") as HTMLDivElement);
    const visibility = element.style.visibility;
    element.style.visibility = visibility === "hidden" ? "visible" :  "hidden";
}

const ChatContent = () => {


    return (
        <div className="chat">
            <div className="chat-header clearfix">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01_green.jpg" alt="avatar" />
            
                <div className="chat-about">
                <div className="chat-with">Chat with Vincent Porter</div>
                </div>
            </div>
            <Messages/>
            <Input/>
        </div> 
    )
}

export default ChatContent