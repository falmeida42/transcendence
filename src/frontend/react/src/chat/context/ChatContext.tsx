import React, { createContext, ReactNode, useState, useEffect, useRef } from "react";
import io from "socket.io-client";

interface ChatContextProps {
  socket: SocketIoReference.Socket | null;
  chatRooms: any
}

interface ChatProviderProps {
  children: ReactNode;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export var tk: string | null;

let updateChatRooms: () => void;

function ChatProvider({ children }: ChatProviderProps) {

  const [socket, setSocket] = useState<SocketIoReference.Socket | null>(null);
  const [chatRooms, setChatRooms] = useState([])

  updateChatRooms = () => {

    fetch(`http://localhost:3000/user/chatRooms`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tk}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.text();
        return data ? JSON.parse(data) : null;
      })
      .then((data) => {
        if (data) {
          console.log("Rooms received ", JSON.stringify(data));
          setChatRooms(data);
        } else {
          console.log("No data received");
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    tk = urlParams.get("token");

    console.log("Frontend: token", tk);

    const socketInstance = io("http://localhost:3000/chat", {
      withCredentials: true,
    }).connect();

    socketInstance.on("connect", () => {
      console.log("Client connected");


      socketInstance.emit("joinChannel", "ok");
    });

    setSocket(socketInstance);

    fetch(`http://localhost:3000/user/chatRooms`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tk}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.text();
        return data ? JSON.parse(data) : null;
      })
      .then((data) => {
        if (data) {
          console.log("Rooms received ", JSON.stringify(data));
          setChatRooms(data);
        } else {
          console.log("No data received");
        }
      })
      .catch((error) => console.error("Fetch error:", error));

    return () => {
      // Cleanup socket connection on component unmount
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  const contextValue: ChatContextProps = {
    socket: socket,
    chatRooms: chatRooms
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

export { ChatContext, ChatProvider, updateChatRooms };
