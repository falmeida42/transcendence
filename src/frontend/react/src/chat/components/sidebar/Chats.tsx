import { socketIoRef } from "../../../network/SocketConnection"
import { toggleChatVisibility } from "../chat/ChatContent"
import { useState, useEffect } from "react";
import ChatInfo from "./ChatInfo";


interface Payload {
    name: string;
    image: string
}

interface RoomData {
    id: string,
    name: string,
    image: string
}

function fetchAvailableRooms(setRooms: React.Dispatch<React.SetStateAction<RoomData[]>>) {
    console.log("fetch available rooms");
    socketIoRef.current.on("availableRooms", (rooms: Payload) => {
      console.log("Received message:", rooms);
      receivedRooms(rooms, setRooms);
    })
    
};

function receivedRooms(room: Payload, setRooms: React.Dispatch<React.SetStateAction<RoomData[]>>) {
    const newRoom: RoomData = {
      id: crypto.randomUUID(),
      name: room.name,
      image: room.image,
    };
  
    console.log("Rooms until set", newRoom);
    setRooms((prevRooms) => [...prevRooms, newRoom]); 
  }


const Chats = () => {


    const rooms: RoomData[] = [
        {
            id: crypto.randomUUID(),
            name: "Vincent Porter",
            image: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01.jpg"
        },
        {
            id: crypto.randomUUID(),
            name: "Peyton Mckinney",
            image: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_10.jpg"
        }
    ]
 
  

    console.log("Current Rooms:", rooms)

    return (
        <div className="chats" onClick={toggleChatVisibility}>
            {
                rooms.map((room) => (
                    <ChatInfo key={room.id} name={room.name} image={room.image}/>
                ))
            }
        </div>
    
    )
}

export default Chats
