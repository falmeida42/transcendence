import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { toggleChatVisibility } from "../chat/ChatContent";
import ChatInfo, { ChatData } from "./ChatInfo";

interface RoomData {
  id: string;
  name: string;
  image: string;
  type: string;
  status: number;
}

interface ChatsProps {
  passSelectedChatData: (data: ChatData) => void;
}

const Chats = (chatsProps: ChatsProps) => {
  const { chatRooms = [], usersOnline } = useContext(ChatContext) ?? {};
  const rooms: RoomData[] = [];

  console.log("friends in chat", chatRooms);
  console.log("Chat list ", usersOnline);

  chatRooms.forEach((room: any) => {
    const matchingUser = usersOnline.find(
      (user: any) => user.username === room.name
    );

    rooms.push({
      id: room.id,
      name: room.name,
      image: room.image || "../../../dog.png",
      type: room.type,
      status: matchingUser ? matchingUser.userStatus : 0, // Use 0 as a default status
    });
  });

  return (
    <div className="chats" onClick={toggleChatVisibility}>
      {rooms.map((room) => (
        <ChatInfo
          passSelectedChatData={chatsProps.passSelectedChatData}
          key={room.id}
          data={{
            id: room.id,
            name: room.name,
            image: room.image,
            type: room.type,
            status: room.status,
          }}
        />
      ))}
    </div>
  );
};

export default Chats;
