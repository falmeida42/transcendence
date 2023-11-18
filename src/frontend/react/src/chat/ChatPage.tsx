import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import "./style.scss"

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