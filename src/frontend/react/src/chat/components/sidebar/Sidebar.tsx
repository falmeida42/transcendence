import Chats from "./Chats"
import Navbar from "./Navbar"
import Search from "./Search"



const Sidebar = () => {
    return (
        <div className="sidebar" id="sidebar">
            <Navbar/>
            <Search/>
            <Chats/>
        </div>
    )
}

export default Sidebar