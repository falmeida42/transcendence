import { useEffect } from "react";
import io from "socket.io-client";


const socket = io("http://localhost:3000/game", { withCredentials: true });

export const Test = () => {


  useEffect(() => {

    socket.on("msgToClient",  => {
    });
  }, []);

  return ();
};
