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
import AdminPopup from "./AdminPopup"
import { tk } from "../../context/ChatContext"
import test from "node:test"

export const toggleChatVisibility = () => {
    const element = (document.getElementById("chat") as HTMLDivElement);
    const visibility = element.style.visibility;
    element.style.visibility = visibility === "hidden" ? "visible" :  "hidden";
}

interface ChatContentProps {
    selectedChatData: ChatData;
    passSelectedChatData: (data: ChatData) => void;
}

const ChatContent = (props: ChatContentProps) => {
    const [isVisibleLeave, setIsVisibleLeave] = useState(false);
    const [isVisibleMatch, setIsVisibleMatch] = useState(false);
    const [isVisibleKick, setIsVisibleKick] = useState(false);
    const [isVisibleBan, setIsVisibleBan] = useState(false);
    const [isVisibleMute, setIsVisibleMute] = useState(false);
    const [isVisibleLock, setIsVisibleLock] = useState(false);
    const [isVisibleAdmin, setIsVisibleAdmin] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [isHovered, setIsHovered] = useState("");
    const [chatData, setChatData] = useState<Data>();

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
    const handleClickAdmin = () => {
        setIsVisibleAdmin(!isVisibleAdmin);
    };

    interface Participant {
        id: string;
        login: string;
        image: string;
        chatRoomId: string | null;
    }
    
    interface Data {
        participants: Participant[]; 
    }
    
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(
              `http://localhost:3000/user/chatRoom/${props.selectedChatData.id}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${tk}`,
                  "Content-Type": "application/json",
                },
              }
            );
    
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log("Room info received ", JSON.stringify(data));
            setChatData(data);
          } catch (error) {
            console.error("Fetch error:", error);
          }
        };
    
        fetchData();
      }, [props.selectedChatData.id]);
   
    
    return (
        <div className="chat">
            {isVisibleLeave && <LeaveChannelPopUp isVisible={isVisibleLeave} channelId={props.selectedChatData.id} passSelectedChatData={props.passSelectedChatData} handleClose={handleClickLeave}/>}
            {isVisibleMatch && <MatchPopup isVisible={isVisibleMatch} channelId={props.selectedChatData.id} handleClose={handleClickMatch}/>}
            {/* only if user is an admin */}
            {isVisibleKick && <KickPopup isVisible={isVisibleKick} channelId={props.selectedChatData.id} handleClose={handleClickKick}/>}
            {isVisibleMute && <MutePopup isVisible={isVisibleMute} channelId={props.selectedChatData.id} handleClose={handleClickMute}/>}            
            {isVisibleBan && <BanPopup isVisible={isVisibleBan} channelId={props.selectedChatData.id} handleClose={handleClickBan}/>}
            {/* only if user is the owner */}
            {isVisibleLock && <LockPopup isVisible={isVisibleLock} channelId={props.selectedChatData.id} handleClose={handleClickLock}/>}
            {isVisibleAdmin && <AdminPopup isVisible={isVisibleAdmin} channelId={props.selectedChatData.id} handleClose={handleClickAdmin}/>}                        
            <div className="chat-header clearfix">
                <div className="chat-about">
                    <div className="chat-with">Chat with {props.selectedChatData.name}</div>
                    <i onClick={handleClickLeave} onMouseEnter={() => handleMouseEnter("leave chatroom")} onMouseLeave={handleMouseLeave} className="fa fa-sign-out fa-lg clickable" ></i>
                    <i onClick={handleClickMatch} onMouseEnter={() => handleMouseEnter("invite user to match")} onMouseLeave={handleMouseLeave} className="fa fa-gamepad fa-lg clickable" ></i>
                    <i onClick={handleClickKick} onMouseEnter={() => handleMouseEnter("kick user")} onMouseLeave={handleMouseLeave} className="fa fa-user-times fa-lg clickable" ></i>
                    <i onClick={handleClickMute} onMouseEnter={() => handleMouseEnter("mute user")} onMouseLeave={handleMouseLeave} className="fa fa-microphone-slash fa-lg clickable" ></i>
                    <i onClick={handleClickBan} onMouseEnter={() => handleMouseEnter("ban user")} onMouseLeave={handleMouseLeave} className="fa fa-ban fa-lg clickable" ></i>
                    <i onClick={handleClickLock} onMouseEnter={() => handleMouseEnter("set password")} onMouseLeave={handleMouseLeave} className="fa fa-lock fa-lg clickable" ></i>
                    <i onClick={handleClickAdmin} onMouseEnter={() => handleMouseEnter("appoint admin")} onMouseLeave={handleMouseLeave} className="fa fa-support fa-lg clickable" ></i>
                    {isHovered !== "" && <div className="hover-label">{isHovered}</div>}
                </div>
                <img src={props.selectedChatData.image} 
                     alt="avatar"
                     onClick={() => {
                        if (props.selectedChatData.type === "DIRECT_MESSAGE") {
                            // go to profile
                        }
                     }}
                     style={{
                        cursor: props.selectedChatData.type === "DIRECT_MESSAGE" ? 'pointer' : 'default'
                     }}
                />
            </div>
            <Messages 
                chatId={props.selectedChatData.id} 
                chatName={props.selectedChatData.name}
                chatImage={props.selectedChatData.image}
                />
            <Input content={props}/>
        </div> 
    )
}

export default ChatContent