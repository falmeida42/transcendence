import Sidebar from "./components/sidebar/Sidebar";
import Chat from "./components/chat/Chat";
import "./style.scss"
import io from "socket.io-client";

export const socketConnection = io("http://localhost:3000/chat", {
  withCredentials: true
});

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