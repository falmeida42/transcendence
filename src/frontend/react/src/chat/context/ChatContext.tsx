import React, { createContext, ReactNode, useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { useApi } from "../../apiStore";
import { MessageData } from "../components/chat/Messages";
import { DefaultEventsMap } from "@socket.io/component-emitter";

interface ChatContextProps {
  socket: SocketIoReference.Socket | null;
  chatRooms: any,
  usersOnline: any,
  setChannelSelected: React.Dispatch<React.SetStateAction<string>>,
  channelMessagesSelected: MessageData[]
}

interface ChatProviderProps {
  children: ReactNode;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export var tk: string | undefined;

let updateChatRooms: () => void;

let socketInstance: Socket<DefaultEventsMap, DefaultEventsMap>;

function ChatProvider({ children }: ChatProviderProps) {

  const [socket, setSocket] = useState<SocketIoReference.Socket | null>(null);
  const [chatRooms, setChatRooms] = useState([])
  const [usersOnline, setUsersOnline] = useState([])
  const [channelSelected, setChannelSelected] = useState("")
  const [channelMessages, setChannelMessages] = useState([])

  const { login } = useApi()

  console.log("channel selected", channelSelected)

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
    tk = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];
    if (tk === undefined)
      return;

    console.log("Frontend: token", tk);

    socketInstance = io("http://localhost:3000/chat", {
      withCredentials: true,
    }).connect();

    console.log("socketInstance", socketInstance)

    socketInstance.on("connect", () => {
      console.log("Client connected!!!!!!!!!!!!!!!!!  ", login, "   ", socketInstance.id);


      socketInstance.emit("userConnected", { username: login, socketId: socketInstance.id });
    });

    socketInstance.on('getUsersConnected', (data) => {

      console.log("Users connected ", data)

      setUsersOnline(data)
    });


    setSocket(socketInstance);

    if (channelSelected) {
      console.log("this is the channel selected: ", channelSelected)

      fetch(`http://localhost:3000/user/chatHistory/${channelSelected}`, {
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
          console.log("Daaaata received ", data);
          
          setChannelMessages((prevChannelMessages) => ({
            ...prevChannelMessages,
            [channelSelected]: data.map((message) => ({
              id: message.id,
              username: message.sender.login,
              userImage: message.sender.image,
              message: message.content,
            })),
          }));
          
          console.log("This is the channelMessages: ", channelMessages)
          console.log("This is the current channel message: ", channelMessages[channelSelected])
          
          
        } else {
          console.log("No data received");
        }

      })
      .catch((error) => console.error("Fetch error:", error));
    }

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




  }, [channelSelected]);

  useEffect(() => {

    socketInstance.on("messageToClient", (payload) => {
      console.log("MESSAGE TO CLIENT: ", JSON.stringify(payload));

      setChannelMessages((prevChannelMessages : any) => {
        const channelId = payload.channelId;

        // Criar uma cópia do estado anterior
        const newChannelMessages = { ...prevChannelMessages} ;

        newChannelMessages[channelId] = newChannelMessages[channelId] || []
        console.log("newChannelMessages before: ", newChannelMessages)
        console.log("newChannelMessages before: ", channelId)

        // Criar uma cópia do array de mensagens do canal específico
        const updatedMessages = [
          ...newChannelMessages[channelId],
          {
            id: payload.id,
            username: payload.sender,
            message: payload.message,
            userImage: payload.senderImage,
          },
        ];
        console.log("newChannelMessages during: ", newChannelMessages)


        // Atualizar apenas o array de mensagens do canal específico
        newChannelMessages[channelId] = updatedMessages;
      
        console.log("newChannelMessages after: ", newChannelMessages)



        console.log("channel messages during construction: ", updatedMessages);

        return newChannelMessages;
      });
    });

  }, []);

  const contextValue: ChatContextProps = {
    socket: socket,
    chatRooms: chatRooms,
    usersOnline: usersOnline,
    setChannelSelected: setChannelSelected,
    channelMessagesSelected: channelMessages[channelSelected] ?? []
  };



  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

export { ChatContext, ChatProvider, updateChatRooms };