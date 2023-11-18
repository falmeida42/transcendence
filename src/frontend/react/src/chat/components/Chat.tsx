import Mute from "../../assets/Mute.png"
import Block from "../../assets/Block.png"


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
        </div>
    )
}

export default Chat