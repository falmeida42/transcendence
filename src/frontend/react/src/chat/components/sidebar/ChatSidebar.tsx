import { useState } from "react";
import Chats from "./Chats"
import Search from "./Search"
import CreateRoomPopup from "../chat/CreateRoomPopup";



interface ChatSidebarProps {
    passSelectedChatData: (data: string) => void;
}

const ChatSidebar = (chatSidebarProps: ChatSidebarProps) => {

    const [isVisible, setIsVisible] = useState(false);

    const handleClick = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className="sidebar">
        {isVisible && <CreateRoomPopup isVisible={isVisible} handleClose={handleClick}/>}
        <div className="search">
            <button className="btn btn-primary" onClick={handleClick}>
                <i className="fa fa-plus mr-2"></i>
                Create Room
            </button> 
        </div>
            {/* <Search/> */}
            <Chats passSelectedChatData={chatSidebarProps.passSelectedChatData}/>
        </div>
    )
}

export default ChatSidebar