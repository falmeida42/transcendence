import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import CreateRoomPopup from "../chat/CreateRoomPopup";
import JoinRoomPopup from "../chat/JoinRoomPopup";
import { ChatData } from "./ChatInfo";
import Chats from "./Chats";

interface ChatSidebarProps {
  passSelectedChatData: (data: ChatData) => void;
}

const ChatSidebar = (chatSidebarProps: ChatSidebarProps) => {
  const [isVisibleJoin, setIsVisibleJoin] = useState(false);
  const [isVisibleCreate, setIsVisibleCreate] = useState(false);
  const { closeWindow, setCloseWindow } = useContext(ChatContext) ?? {};

  useEffect(() => {
    if (closeWindow) {
      chatSidebarProps.passSelectedChatData({
        id: "",
        name: "",
        image: "",
        type: "",
        status: 0,
      });
      if (setCloseWindow) setCloseWindow(false);
    }
  }, [chatSidebarProps, closeWindow, setCloseWindow]);

  const handleClickJoin = () => {
    setIsVisibleJoin(!isVisibleJoin);
  };

  const handleClickCreate = () => {
    setIsVisibleCreate(!isVisibleCreate);
  };

  return (
    <div className="sidebar">
      {isVisibleCreate && (
        <CreateRoomPopup
          isVisible={isVisibleCreate}
          handleClose={handleClickCreate}
        />
      )}
      {isVisibleJoin && (
        <JoinRoomPopup
          isVisible={isVisibleJoin}
          handleClose={handleClickJoin}
        />
      )}
      <div>
        <div className="search">
          <button
            className="btn btn-primary mr-2 mb-2"
            onClick={handleClickCreate}
          >
            <i className="fa fa-plus mr-2"></i>
            Create Channel
          </button>
          <button className="btn btn-primary mb-2" onClick={handleClickJoin}>
            <i className="fa fa-hand-o-up mr-2"></i>
            Join Channel
          </button>
        </div>
      </div>
      <Chats passSelectedChatData={chatSidebarProps.passSelectedChatData} />
    </div>
  );
};

export default ChatSidebar;
