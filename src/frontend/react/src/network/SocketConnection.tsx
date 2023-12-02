import { useEffect, useRef } from "react";
import io from "socket.io-client";

export var socketIoRef: SocketIoReference.Socket;
export var currentUsername: string | null;
export var currentRoom: string | null;

export const Mapping: React.FunctionComponent = () => {
  
  socketIoRef = useRef<SocketIoReference.Socket>();
  useEffect(() => {
    socketIoRef.current = io("http://localhost:3000/chat", 
    {withCredentials: true}
    ).connect();

    socketIoRef.current.on('connect', () => {
      console.log('Client connected')

      const urlParams = new URLSearchParams(window.location.search);
      currentUsername = urlParams.get('name');
      currentRoom = urlParams.get('room');
      const payload = {id: crypto.randomUUID(), username: currentUsername }
      console.log(`sending payload ${payload.username}`)

      socketIoRef.current.emit('joinChannel', currentRoom)
    })
  }, []);
  

  return <div>Transcendence</div>;
}