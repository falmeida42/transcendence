/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useReducer } from "react";
import { io } from "socket.io-client";
import { Match } from "../types/Match";
import { Room } from "../types/Room";

type action = {
  type: string;
  payload: any;
};

type state = {
  isConnected: boolean;
  username?: string;
  room?: Room;
  match?: Match;
};

const initialState: state = {
  isConnected: false,
  room: undefined,
  match: undefined,
  username: "",
};

const socket = io("http://localhost:3000/gamer", { autoConnect: false });

const disconnect = () => {
  socket.off("connect");
  socket.off("disconnect");
  socket.off("RoomCreated");
  socket.off("MatchRefresh");
  socket.disconnect();
};

let set_name: (name: string) => void;

const SocketContext = React.createContext(initialState);

const SocketProvider = (props: any) => {
  const reducer = (state: state, action: action): state => {
    switch (action.type) {
      case "CONNECTED":
        return { ...state, isConnected: action.payload };
      case "DISCONNECTED":
        return { ...state, isConnected: action.payload };
      case "NAME_SET":
        return { ...state, username: action.payload };
      case "ROOM_CREATED":
        return { ...state, room: action.payload };
      case "MATCH_REFRESH":
        return { ...state, match: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Conectado!");
      dispatch({ type: "CONNECTED", payload: true });
    });

    socket.on("disconnect", () => {
      console.log("Desconectado!");
      dispatch({ type: "DISCONNECTED", payload: false });
    });

    socket.on("RoomCreated", (room) => {
      dispatch({ type: "ROOM_CREATED", payload: room });
    });

    socket.on("MatchRefresh", (match) => {
      // console.log("MatchRefresh", match.ball);
      dispatch({ type: "MATCH_REFRESH", payload: match });
    });

    socket.on("GameOver", () => {
      dispatch({ type: "MATCH_REFRESH", payload: undefined });
    });

    set_name = (name: string) => {
      if (!name.trim()) return;
      dispatch({ type: "NAME_SET", payload: name });
      socket.emit("Login", { name: name });
    };

    socket.connect();
    return () => disconnect();
  }, []);

  return (
    <SocketContext.Provider value={state}>
      {props.children}
    </SocketContext.Provider>
  );
};

// Helper Functions
const createRoom = (againstAi: boolean) => {
  socket.emit("CreateRoom", { againstAi });
};

const gameLoaded = () => {
  socket.emit("GameLoaded");
};

let lastType: string | undefined = undefined;
const sendKey = (key: string, type: string) => {
  if (lastType === type) {
    return;
  }
  lastType = type;
  socket.emit("SendKey", { key, type });
};

export {
  SocketContext,
  SocketProvider,
  createRoom,
  gameLoaded,
  sendKey,
  set_name,
};
