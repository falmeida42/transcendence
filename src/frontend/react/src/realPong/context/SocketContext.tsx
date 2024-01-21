/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useReducer } from "react";
import { io } from "socket.io-client";
import { useApi } from "../../apiStore";
import { Match } from "../types/Match";
import { Room } from "../types/Room";

type action = {
  type: string;
  payload: any;
};

type state = {
  isConnected: boolean;
  username?: string;
  login?: string;
  room?: Room;
  match?: Match;
  onQueue: boolean;
  socketId?: string;
  rooms?: Room[];
};

const initialState: state = {
  isConnected: false,
  room: undefined,
  match: undefined,
  username: "",
  login: "",
  onQueue: false,
  socketId: "",
};

const socket = io("http://localhost:3000/gamer", { autoConnect: false });

const disconnect = () => {
  socket.off("connect");
  socket.off("disconnect");
  socket.off("RoomCreated");
  socket.off("MatchRefresh");
  socket.off("GameOver");
  socket.off("QueueJoined");
  socket.off("QueueLeft");
  socket.disconnect();
};

let set_name: (name: string, username: string) => void;
let clearRoom: () => void;

const SocketContext = React.createContext(initialState);

let name: string;
let username: string;

const SocketProvider = (props: any) => {
  const { login, user } = useApi();
  name = login;
  username = user;
  const reducer = (state: state, action: action): state => {
    switch (action.type) {
      case "CONNECTED":
        return { ...state, isConnected: action.payload, socketId: socket.id };
      case "DISCONNECTED":
        return { ...state, isConnected: action.payload };
      case "NAME_SET":
        return {
          ...state,
          username: action.payload.username,
          login: action.payload.login,
          match: undefined,
        };
      case "ROOM_CREATED":
        return { ...state, room: action.payload };
      case "MATCH_REFRESH":
        return { ...state, match: action.payload, onQueue: false };
      case "QUEUE_JOINED":
        return { ...state, onQueue: action.payload };
      case "SET_WINNER":
        return {
          ...state,
          room: action.payload,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  // const { login, user } = useApi();
  useEffect(() => {
    socket.on("connect", async () => {
      dispatch({ type: "CONNECTED", payload: true });
    });

    socket.on("disconnect", () => {
      dispatch({ type: "DISCONNECTED", payload: false });
    });

    socket.on("RoomCreated", (room) => {
      dispatch({ type: "ROOM_CREATED", payload: room });
    });

    socket.on("MatchRefresh", (match) => {
      dispatch({ type: "MATCH_REFRESH", payload: match });
    });

    socket.on("QueueJoined", () => {
      dispatch({ type: "QUEUE_JOINED", payload: true });
    });

    socket.on("QueueLeft", () => {
      dispatch({ type: "QUEUE_JOINED", payload: false });
    });

    socket.on("GameOver", () => {
      dispatch({ type: "SET_WINNER", payload: undefined });
    });

    set_name = (name: string, username: string) => {
      if (!name.trim()) return;
      dispatch({ type: "NAME_SET", payload: { name, username } });
      socket.emit("Login", { name: name.trim(), username: username });
    };

    clearRoom = () => {
      dispatch({ type: "SET_WINNER", payload: undefined });
    };

    socket.connect();
    return () => disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SocketContext.Provider value={state}>
      {props.children}
    </SocketContext.Provider>
  );
};

// Helper Functions
const createRoom = (againstAi: boolean) => {
  socket.emit("CreateRoomAgainstAi", { againstAi });
};

const gameLoaded = () => {
  socket.emit("GameLoaded");
};

const sendKey = (key: string, type: string) => {
  socket.emit("SendKey", { key, type });
};

const joinQueue = () => {
  socket.emit("JoinQueue");
};

const leaveQueue = () => {
  socket.emit("LeaveQueue");
};

const pauseGame = () => {
  socket.emit("PauseMatch");
};

const joinRoomSpec = (roomId: string) => {
  socket.emit("JoinRoomSpec", { roomId });
};

const leaveRoom = () => {
  socket.emit("LeaveRoom");
};

const joinRoomInvite = (roomId: string) => {
  set_name(name, username);
  socket.emit("joinRoom", { roomId: roomId });
};

export {
  SocketContext,
  SocketProvider,
  clearRoom,
  createRoom,
  gameLoaded,
  joinQueue,
  joinRoomInvite,
  joinRoomSpec,
  leaveQueue,
  leaveRoom,
  pauseGame,
  sendKey,
  set_name,
};
