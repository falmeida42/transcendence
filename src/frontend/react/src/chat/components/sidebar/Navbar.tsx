import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

export const toggleNavBarVisibility = () => {
    const sideBar = (document.getElementById("sidebar") as HTMLDivElement);
    const sideBarVisibility = sideBar.style.visibility;

    sideBar.style.visibility = sideBarVisibility === "hidden" ? "visible" : "hidden";
}

const Navbar = () => {
    const {username = "", image = ""} = useContext(ChatContext) ?? {}

    return (
        <div className="navbar" onClick={toggleNavBarVisibility}>
            <div className="user">
                <img src={image} alt=""/>
                <span>{username}</span>
            </div>
        </div>
    )
}

export default Navbar