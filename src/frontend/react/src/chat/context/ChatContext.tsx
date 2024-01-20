import { DefaultEventsMap } from "@socket.io/component-emitter";
import React, { ReactNode, createContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useApi } from "../../apiStore";
import { MessageData } from "../components/chat/Messages";

interface ChatContextProps {
  socket: SocketIoReference.Socket | null;
  chatRooms: any;
  usersOnline: any;
  setChannelSelected: React.Dispatch<React.SetStateAction<string>>;
  channelMessagesSelected: MessageData[];
  closeWindow: boolean;
  setCloseWindow: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ChatProviderProps {
  children: ReactNode;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

let updateChatRooms: () => void;

let socketInstance: Socket<DefaultEventsMap, DefaultEventsMap>;

let test: (id?: string) => void;
let kick: (usernameId: string, roomId: string) => void;
let updateStatus: (id: string, status: number) => void;

function ChatProvider({ children }: ChatProviderProps) {
  const [socket, setSocket] = useState<SocketIoReference.Socket | null>(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [usersOnline, setUsersOnline] = useState([]);
  const [channelSelected, setChannelSelected] = useState("");
  const [channelMessages, setChannelMessages] = useState([]);
  const [closeWindow, setCloseWindow] = useState(false);

  const { id } = useApi();

  updateChatRooms = () => {
    const tk = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    fetch(`http://localhost:3000/user/chatRooms`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tk}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          // console.log("fatal errorrr");
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.text();
        return data ? JSON.parse(data) : null;
      })
      .then((data) => {
        if (data) {
          setChatRooms(data);
        } else {
          console.log("No data received");
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  };

  useEffect(() => {
    const tk = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (channelSelected) {
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
            setChannelMessages((prevChannelMessages) => ({
              ...prevChannelMessages,
              [channelSelected]: data.map((message: any) => ({
                id: message.id,
                username: message.sender.username,
                userImage: message.sender.image,
                message: message.content,
              })),
            }));
          } else {
            console.log("No data received");
          }
        })
        .catch();
    }

    updateChatRooms();
  }, [channelSelected]);

  useEffect(() => {
    socketInstance = io("http://localhost:3000/chat", {
      withCredentials: true,
    }).connect();

    socketInstance.on("connect", () => {
      socketInstance.emit("userConnected", {
        id: id,
        socketId: socketInstance.id,
      });
    });

    socketInstance.on("getUsersConnected", (data) => {
      setUsersOnline(data);
    });

    socketInstance.on("UpdateRooms", () => {
      updateChatRooms();
      socketInstance.emit("joinAllRooms", { id: id });
    });

    setSocket(socketInstance);

    socketInstance.on("messageToClient", (payload) => {
      // console.log("MESSAGE TO CLIENT: ", JSON.stringify(payload));

      setChannelMessages((prevChannelMessages: any) => {
        const channelId = payload.channelId;

        // Criar uma cópia do estado anterior
        const newChannelMessages = { ...prevChannelMessages };

        newChannelMessages[channelId] = newChannelMessages[channelId] || [];
        // console.log("newChannelMessages before: ", newChannelMessages)
        // console.log("newChannelMessages before: ", channelId)

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
        // console.log("newChannelMessages during: ", newChannelMessages)

        // Atualizar apenas o array de mensagens do canal específico
        newChannelMessages[channelId] = updatedMessages;

        // console.log("newChannelMessages after: ", newChannelMessages)

        // console.log("channel messages during construction: ", updatedMessages);

        return newChannelMessages;
      });
    });

    socketInstance.on("closeRoom", () => {
      setCloseWindow(true);
    });

    test = () => {
      socketInstance.emit("AddChannel");
      socketInstance.emit("joinAllRooms", { id: id });
    };

    kick = (usernameId: string, roomId: string) => {
      socketInstance.emit("kickFromRoom", { id: usernameId, roomId: roomId });
    };

    updateStatus = (id: string, status: number) => {
      socketInstance.emit("updateStatus", { id: id, status: status });
    };

    return () => {
      socketInstance.disconnect();
    };
  }, [id]);

  const contextValue: ChatContextProps = {
    socket: socket,
    chatRooms: chatRooms,
    usersOnline: usersOnline,
    setChannelSelected: setChannelSelected,
    channelMessagesSelected: channelMessages[channelSelected] ?? [],
    closeWindow: closeWindow,
    setCloseWindow: setCloseWindow,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
}

export { ChatContext, ChatProvider, kick, test, updateChatRooms, updateStatus };
