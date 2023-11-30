import Mute from "../../../assets/Mute.png"
import Block from "../../../assets/Block.png"
import Messages from "./Messages"
import Input from "./Input"

export const toggleChatVisibility = () => {
    const element = (document.getElementById("chat") as HTMLDivElement);
    const visibility = element.style.visibility;
    element.style.visibility = visibility === "hidden" ? "visible" :  "hidden";
}

const Chat = () => {


    return (
        <div className="chat"  id="chat">
            <div className="chatInfo"  onClick={toggleChatVisibility}>
                <span>Friend</span>
                <div className="chatIcons">
                    <img src={Mute} alt=""/>
                    <img src={Block} alt=""/>
                </div>
            </div>
            <Messages/>
            <Input/>
        </div>
    )
}

export default Chat