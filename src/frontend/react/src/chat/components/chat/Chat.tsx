import Mute from "../../../assets/Mute.png"
import Block from "../../../assets/Block.png"
import Messages from "./Messages"
import Input from "./Input"


const Chat = () => {
    return (
        <div className="chat">
            <div className="chatInfo">
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