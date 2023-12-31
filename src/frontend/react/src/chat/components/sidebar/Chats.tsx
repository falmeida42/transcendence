import { toggleChatVisibility } from "../chat/ChatContent"
import ChatInfo from "./ChatInfo";
import { useContext} from "react";
import { ChatContext } from "../../context/ChatContext";

interface RoomData {
    id: string,
    name: string,
    image: string
}

interface ChatsProps {
    passSelectedChatData: (data: string) => void;
}


const Chats = (chatsProps: ChatsProps) => {


    const {friends = []} = useContext(ChatContext) ?? {}
    const rooms: RoomData[] = []

    console.log("friends in chat", friends)

    friends.map((friend : any) => (
        rooms.push(
            {
                id: friend.id,
                name: friend.login,
                image: friend.image
            }
        )
    ))


    return (
        <div className="chats" onClick={toggleChatVisibility}>
            {
                rooms.map((room) => (
                    <ChatInfo passSelectedChatData={chatsProps.passSelectedChatData} key={room.id} name={room.name} image={room.image}/>
                ))
            }
        </div>
    
    )
}

export default Chats
