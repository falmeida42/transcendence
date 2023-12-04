import { socketIoRef } from "../../../network/SocketConnection"
import { toggleChatVisibility } from "../chat/Chat"
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
    const [rooms, setRooms] = useState<RoomData[]>([]);

    useEffect(() => {

        fetchAvailableRooms(setRooms)
        return () => {

        }
    }, []);

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