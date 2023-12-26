import Chats from "./Chats"
import Navbar from "./Navbar"
import Search from "./Search"
import { ChatProvider } from "../../context/ChatContext"
import { useContext } from "react"
import { ChatContext } from "../../context/ChatContext"


const Sidebar = () => {
    const context = useContext(ChatContext)
    return (
        <div className="sidebar" id="sidebar">
            <ChatProvider>
                <Navbar/>
                <Search/>
                <Chats/>
            </ChatProvider>
        </div>
    )
}

export default Sidebar