import Chats from "./Chats"
import Search from "./Search"

const ChatSidebar = () => {
    return (
        <div className="sidebar">
            <Search/>
            <Chats/>
        </div>
    )
}

export default ChatSidebar