import React from "react";
import Sidebar from "./chat/components/Sidebar";
import Chat from "./chat/components/Chat";

const Home = () => {
    return(
        <div className="home">
            <div className="container"></div>
            <Sidebar/>
            <Chat/>
        </div>
    )
}

export default Home