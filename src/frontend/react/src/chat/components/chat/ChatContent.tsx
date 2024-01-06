import Messages from "./Messages"
import Input from "./Input"
import { useEffect, useState } from "react"
import { ChatData } from "../sidebar/ChatInfo"
import LeaveChannelPopUp from "./LeaveChannelPopUp"
import MatchPopup from "./MatchPopup"
import KickPopup from "./KickPopup"
import MutePopup from "./MutePopup"
import BanPopup from "./BanPopup"
import LockPopup from "./LockPopup"

export const toggleChatVisibility = () => {
    const element = (document.getElementById("chat") as HTMLDivElement);
    const visibility = element.style.visibility;
    element.style.visibility = visibility === "hidden" ? "visible" :  "hidden";
}

interface ChatContentProps {
    selectedChatData: ChatData;
    passSelectedChatData: (data: ChatData) => void;
}

const ChatContent = (chatContentProps: ChatContentProps) => {
    const [isVisibleLeave, setIsVisibleLeave] = useState(false);
    const [isVisibleMatch, setIsVisibleMatch] = useState(false);
    const [isVisibleKick, setIsVisibleKick] = useState(false);
    const [isVisibleBan, setIsVisibleBan] = useState(false);
    const [isVisibleMute, setIsVisibleMute] = useState(false);
    const [isVisibleLock, setIsVisibleLock] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [isHovered, setIsHovered] = useState("");

    const handleMouseEnter = (label: string) => {
        setIsHovered(label);
    };
    const handleMouseLeave = () => {
        setIsHovered("");
    };
    
    const handleClickLeave = () => {
        setIsVisibleLeave(!isVisibleLeave);
    };
    const handleClickMatch = () => {
        setIsVisibleMatch(!isVisibleMatch);
    };
    const handleClickKick = () => {
        setIsVisibleKick(!isVisibleKick);
    };
    const handleClickMute = () => {
        setIsVisibleMute(!isVisibleMute);
    };
    const handleClickBan = () => {
        setIsVisibleBan(!isVisibleBan);
    };
    const handleClickLock = () => {
        setIsVisibleLock(!isVisibleLock);
    };

    
    return (
        <div className="chat">
            {isVisibleLeave && <LeaveChannelPopUp isVisible={isVisibleLeave} channelId={chatContentProps.selectedChatData.id} passSelectedChatData={chatContentProps.passSelectedChatData} handleClose={handleClickLeave}/>}
            {isVisibleMatch && <MatchPopup isVisible={isVisibleMatch} channelId={chatContentProps.selectedChatData.id} handleClose={handleClickMatch}/>}
            {/* only if user is an admin */}
            {isVisibleKick && <KickPopup isVisible={isVisibleKick} channelId={chatContentProps.selectedChatData.id} handleClose={handleClickKick}/>}
            {isVisibleMute && <MutePopup isVisible={isVisibleMute} channelId={chatContentProps.selectedChatData.id} handleClose={handleClickMute}/>}            
            {isVisibleBan && <BanPopup isVisible={isVisibleBan} channelId={chatContentProps.selectedChatData.id} handleClose={handleClickBan}/>}
            {/* only if chatroom is not protected */}
            {isVisibleLock && <LockPopup isVisible={isVisibleLock} channelId={chatContentProps.selectedChatData.id} handleClose={handleClickLock}/>}                       
            <div className="chat-header clearfix">
                <div className="chat-about">
                    <div className="chat-with">Chat with {chatContentProps.selectedChatData.name}</div>
                    <i onClick={handleClickLeave} onMouseEnter={() => handleMouseEnter("leave chatroom")} onMouseLeave={handleMouseLeave} className="fa fa-sign-out fa-lg clickable" ></i>
                    <i onClick={handleClickMatch} onMouseEnter={() => handleMouseEnter("invite user to match")} onMouseLeave={handleMouseLeave} className="fa fa-gamepad fa-lg clickable" ></i>
                    <i onClick={handleClickKick} onMouseEnter={() => handleMouseEnter("kick user")} onMouseLeave={handleMouseLeave} className="fa fa-user-times fa-lg clickable" ></i>
                    <i onClick={handleClickMute} onMouseEnter={() => handleMouseEnter("mute user")} onMouseLeave={handleMouseLeave} className="fa fa-microphone-slash fa-lg clickable" ></i>
                    <i onClick={handleClickBan} onMouseEnter={() => handleMouseEnter("ban user")} onMouseLeave={handleMouseLeave} className="fa fa-ban fa-lg clickable" ></i>
                    <i onClick={handleClickLock} onMouseEnter={() => handleMouseEnter("set password")} onMouseLeave={handleMouseLeave} className="fa fa-lock fa-lg clickable" ></i>
                    {isHovered !== "" && <div className="hover-label">{isHovered}</div>}
                </div>
                <img src={chatContentProps.selectedChatData.image} 
                     alt="avatar"
                     onClick={() => {
                        if (chatContentProps.selectedChatData.type === "DIRECT_MESSAGE") {
                            // go to profile
                        }
                     }}
                     style={{
                        cursor: chatContentProps.selectedChatData.type === "DIRECT_MESSAGE" ? 'pointer' : 'default'
                     }}
                />
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