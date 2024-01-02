import { ChatData } from "./ChatInfo";
import Chats from "./Chats"
import Search from "./Search"


interface ChatSidebarProps {
    passSelectedChatData: (data: ChatData) => void;
}

const ChatSidebar = (chatSidebarProps: ChatSidebarProps) => {
    return (
        <div className="sidebar">
            <Search/>
            <Chats passSelectedChatData={chatSidebarProps.passSelectedChatData}/>
        </div>
    )
}

export default ChatSidebar