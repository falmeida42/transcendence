import Sidebar from "./components/sidebar/Sidebar";
import Chat from "./components/chat/Chat";
import "./Chat.scss"


const ChatPage = () => {
    return(
        <div className="chatPage">
            <div className="container">
            <Sidebar/>
            <Chat/>
            </div>
        </div>
    )
}

export default ChatPage