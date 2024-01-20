/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useReducer } from "react";
import { io } from "socket.io-client";

type action = {
  type: string;
  payload: any;
};

type state = {
  isConnected: boolean;
  username?: string;
  socketId?: string;
};

const initialState: state = {
  isConnected: false,
  username: "",
  socketId: "",
};

const socket = io("http://localhost:3000/chat", { autoConnect: false });

const disconnect = () => {
  socket.off("connect");
  socket.off("disconnect");
  socket.disconnect();
};

const ChatSocket = React.createContext(initialState);

const ChatsProvider = (props: any) => {
  const reducer = (state: state, action: action): state => {
    switch (action.type) {
      case "CONNECTED":
        return { ...state, isConnected: action.payload, socketId: socket.id };
      case "DISCONNECTED":
        return { ...state, isConnected: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    socket.on("connect", () => {
      dispatch({ type: "CONNECTED", payload: true });
    });

    socket.on("disconnect", () => {
      dispatch({ type: "DISCONNECTED", payload: false });
    });

    socket.on("RoomCreated", (room) => {
      dispatch({ type: "ROOM_CREATED", payload: room });
    });

    socket.connect();
    return () => disconnect();
  }, []);

  return (
    <ChatSocket.Provider value={state}>{props.children}</ChatSocket.Provider>
  );
};

// Helper Functions
const createRoom = (againstAi: boolean) => {
  socket.emit("CreateRoomAgainstAi", { againstAi });
};

export { ChatSocket, ChatsProvider, createRoom };
