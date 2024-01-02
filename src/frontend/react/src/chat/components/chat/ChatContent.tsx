import Messages from "./Messages"
import Input from "./Input"
import BlockPopup from "./BlockPopup"
import MatchPopup from "./MatchPopup"
import { useEffect, useState } from "react"
import { tk } from "../../context/ChatContext"
import { ChatData } from "../sidebar/ChatInfo"

export const toggleChatVisibility = () => {
    const element = (document.getElementById("chat") as HTMLDivElement);
    const visibility = element.style.visibility;
    element.style.visibility = visibility === "hidden" ? "visible" :  "hidden";
}

interface ChatContentProps {
    selectedChatData: ChatData;
}

const ChatContent = (chatContentProps: ChatContentProps) => {
    const [isVisibleBlock, setIsVisibleBlock] = useState(false);
    const [isVisibleMatch, setIsVisibleMatch] = useState(false);

    const handleClickBlock = () => {
        setIsVisibleBlock(!isVisibleBlock);
    };

    const handleClickMatch = () => {
        setIsVisibleMatch(!isVisibleMatch);
    };
    

    return (
        <div className="chat">
            {isVisibleBlock && <BlockPopup isVisible={isVisibleBlock} handleClose={handleClickBlock}/>}
            {isVisibleMatch && <MatchPopup isVisible={isVisibleMatch} handleClose={handleClickMatch}/>}
            <div className="chat-header clearfix">
                <img src={chatContentProps.selectedChatData.image} alt="avatar" />
                <div className="chat-about">
                <div className="chat-with">Chat with {chatContentProps.selectedChatData.name}</div>
                <i onClick={handleClickBlock} className="fa fa-ban fa-lg clickable" ></i>
                <i onClick={handleClickMatch} className="fa fa-gamepad fa-lg clickable" ></i>
                </div>
            </div>
            <Messages 
                chatId={chatContentProps.selectedChatData.id} 
                chatName={chatContentProps.selectedChatData.name}
                chatImage={chatContentProps.selectedChatData.image}
                />
            <Input content={chatContentProps}/>
        </div> 
    )
}

export default ChatContent