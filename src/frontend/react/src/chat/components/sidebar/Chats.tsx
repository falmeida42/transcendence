import { toggleChatVisibility } from "../chat/ChatContent"
import ChatInfo, { ChatData } from "./ChatInfo";
import { useContext} from "react";
import { ChatContext } from "../../context/ChatContext";

interface RoomData {
    id: string,
    name: string,
    image: string,
    type: string
}

interface ChatsProps {
    passSelectedChatData: (data: ChatData) => void;
}

const Chats = (chatsProps: ChatsProps) => {


    const {chatRooms = []} = useContext(ChatContext) ?? {}
    const rooms: RoomData[] = []

    console.log("friends in chat", chatRooms)

    chatRooms.map((room : any) => (
        rooms.push(
            {
                id: room.id,
                name: room.name,
                image: room.image,
                type: room.type
            }
        )
    ))


    return (
        <div className="chats" onClick={toggleChatVisibility}>
            {
                rooms.map((room) => (
                    <ChatInfo passSelectedChatData={chatsProps.passSelectedChatData}
                     key={room.id} 
                     data={{
                        id: room.id, 
                        name: room.name, 
                        image: room.image,
                        type: room.type
                    }}/>
                ))
            }
        </div>
    
    )
}

export default Chats
