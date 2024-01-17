import { useEffect, useState } from "react";
import { navigate } from "wouter/use-location";
import { useApi } from "../../../apiStore";
import { ChatData } from "../sidebar/ChatInfo";
import AdminPopup from "./AdminPopup";
import BanPopup from "./BanPopup";
import Input from "./Input";
import KickPopup from "./KickPopup";
import LeaveChannelPopUp from "./LeaveChannelPopUp";
import LockPopup from "./LockPopup";
import MatchPopup from "./MatchPopup";
import Messages from "./Messages";
import MutePopup from "./MutePopup";

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
  const { id } = useApi();
  const [userIsAdmin, setUserIsAdmin] = useState(true);
  const [userIsOwner, setUserIsOwner] = useState(true);

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

  interface User {
    id: string;
  }

  interface Admin {
    id: string;
  }

  interface Data {
    participants: Participant[];
    admins: Admin[];
    owner: User;
  }

  useEffect(() => {
    setUserIsOwner(true);
    setUserIsAdmin(true);

    const fetchData = async () => {
      try {
        const tk = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];
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
        if (data.owner.id !== id) setUserIsOwner(false);
        const isAdmin = data.admins.some((admin) => admin.id === id);
        if (!isAdmin) {
          setUserIsAdmin(false);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
    console.log("IsOwner: ", userIsOwner, "IsAdmin: ", userIsAdmin);
  }, [props.selectedChatData.id]);

  return (
    <div id="chat" className="chat">
      {isVisibleLeave && (
        <LeaveChannelPopUp
          isVisible={isVisibleLeave}
          channelId={props.selectedChatData.id}
          passSelectedChatData={props.passSelectedChatData}
          handleClose={handleClickLeave}
        />
      )}
      {isVisibleMatch && (
        <MatchPopup
          isVisible={isVisibleMatch}
          channelId={props.selectedChatData.id}
          handleClose={handleClickMatch}
        />
      )}
      {isVisibleKick && (
        <KickPopup
          isVisible={isVisibleKick}
          channelId={props.selectedChatData.id}
          handleClose={handleClickKick}
        />
      )}
      {isVisibleMute && (
        <MutePopup
          isVisible={isVisibleMute}
          channelId={props.selectedChatData.id}
          handleClose={handleClickMute}
        />
      )}
      {isVisibleBan && (
        <BanPopup
          isVisible={isVisibleBan}
          channelId={props.selectedChatData.id}
          handleClose={handleClickBan}
        />
      )}
      {isVisibleLock && (
        <LockPopup
          isVisible={isVisibleLock}
          channelId={props.selectedChatData.id}
          handleClose={handleClickLock}
        />
      )}
      {isVisibleAdmin && (
        <AdminPopup
          isVisible={isVisibleAdmin}
          channelId={props.selectedChatData.id}
          handleClose={handleClickAdmin}
        />
      )}
      <div className="chat-header clearfix">
        <div className="chat-about">
          <div className="chat-with">
            Chat with {props.selectedChatData.name}
          </div>
          <i
            onClick={handleClickLeave}
            onMouseEnter={() => handleMouseEnter("leave chatroom")}
            onMouseLeave={() => handleMouseLeave()}
            className="fa fa-sign-out fa-lg clickable"
          ></i>
          <i
            onClick={handleClickMatch}
            onMouseEnter={() => handleMouseEnter("invite user to match")}
            onMouseLeave={() => handleMouseLeave()}
            className="fa fa-gamepad fa-lg clickable"
          ></i>
          {(userIsAdmin || userIsOwner) && (
            <i
              onClick={handleClickKick}
              onMouseEnter={() => handleMouseEnter("kick user")}
              onMouseLeave={() => handleMouseLeave()}
              className="fa fa-user-times fa-lg clickable"
            ></i>
          )}
          {(userIsAdmin || userIsOwner) && (
            <i
              onClick={handleClickMute}
              onMouseEnter={() => handleMouseEnter("mute user")}
              onMouseLeave={() => handleMouseLeave()}
              className="fa fa-microphone-slash fa-lg clickable"
            ></i>
          )}
          {(userIsAdmin || userIsOwner) && (
            <i
              onClick={handleClickBan}
              onMouseEnter={() => handleMouseEnter("ban user")}
              onMouseLeave={() => handleMouseLeave()}
              className="fa fa-ban fa-lg clickable"
            ></i>
          )}
          {userIsOwner && (
            <i
              onClick={handleClickLock}
              onMouseEnter={() => handleMouseEnter("set password")}
              onMouseLeave={() => handleMouseLeave()}
              className="fa fa-lock fa-lg clickable"
            ></i>
          )}
          {userIsOwner && (
            <i
              onClick={handleClickAdmin}
              onMouseEnter={() => handleMouseEnter("appoint admin")}
              onMouseLeave={() => handleMouseLeave()}
              className="fa fa-support fa-lg clickable"
            ></i>
          )}
          {isHovered !== "" && <div className="hover-label">{isHovered}</div>}
        </div>
        <img
          src={props.selectedChatData.image}
          alt="avatar"
          onClick={() => {
            if (props.selectedChatData.type === "DIRECT_MESSAGE") {
              const otherUser = chatData?.participants.find(
                (participant) => participant.id !== id
              );
              navigate(`/Profile/${otherUser?.login}`);
            }
          }}
          style={{
            cursor:
              props.selectedChatData.type === "DIRECT_MESSAGE"
                ? "pointer"
                : "default",
          }}
        />
      </div>
      <Messages
        chatId={props.selectedChatData.id}
        chatName={props.selectedChatData.name}
        chatImage={props.selectedChatData.image}
      />
      <Input content={props} />
    </div>
  );
};

export default ChatContent;
