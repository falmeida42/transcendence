import { useContext, useState } from "react";
import { useApi } from "../../../apiStore";
import { ChatContext } from "../../context/ChatContext";
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
  let matchingUser;
  const { id } = useApi();
  const [userStatus, setUserStatus] = useState(0);

  // console.log("friends in chat", chatRooms);
  // console.log("Chat list ", usersOnline);

  chatRooms.forEach((room: any) => {
    if (room.type === "DIRECT_MESSAGE") {
      const otherUser = room.participants.filter(
        (participant) => participant.id !== id
      )[0];

      const userStatus = usersOnline.filter((user) => {
        console.log("user.userId ", user.userId, "otherUser.id", otherUser.id);
        return user.userId === otherUser.id;
      })[0];

      console.log("user status -> ", JSON.stringify(userStatus));
      if (!userStatus) {
        rooms.push({
          id: room.id,
          name: room.name,
          image: room.image,
          type: room.type,
          status: 0,
        });
      } else {
        rooms.push({
          id: room.id,
          name: room.name,
          image: room.image,
          type: room.type,
          status: userStatus.userStatus,
        });
      }
    } else {
      rooms.push({
        id: room.id,
        name: room.name,
        image: room.image,
        type: room.type,
        status: 0,
      });
    }
  });

  return (
    <div className="chats">
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
