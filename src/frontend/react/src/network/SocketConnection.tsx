import { useEffect, useRef } from "react";
import io from "socket.io-client";

export var socketIoRef: SocketIoReference.Socket;
export var currentUsername: string | null;

export const Mapping: React.FunctionComponent = () => {
  
  socketIoRef = useRef<SocketIoReference.Socket>();
  useEffect(() => {
    socketIoRef.current = io("http://localhost:3000", 
    {withCredentials: true}
    ).connect();

    socketIoRef.current.on('connect', () => {
      console.log('Client connected')

      const urlParams = new URLSearchParams(window.location.search);
      currentUsername = urlParams.get('name');
      const payload = {id: crypto.randomUUID(), username: currentUsername, room: "global"}
      console.log(`sending payload ${payload.username}`)
      
      socketIoRef.current.emit('clientConnected', payload)
    })
  }, []);
  

  return <div>Transcendence</div>;
}