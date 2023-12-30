/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useReducer } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000/game", { autoConnect: false });

type action = {
  type: string;
  payload: any;
};

type state = {
  isConnected: boolean;
  players: any;
  rooms: any;
  room: object;
  player: any;
  messages: string[];
  match: any;
};

const reducer = (state: state, action: action) => {
  switch (action.type) {
    case "CONNECTED":
      return { ...state, isConnected: action.payload };
    case "DISCONNECTED":
      return { ...state, isConnected: action.payload };
    case "PLAYERS":
      return { ...state, players: action.payload };
    case "PLAYER":
      return { ...state, player: action.payload };
    case "ROOMS":
      return { ...state, rooms: action.payload };
    case "ROOM":
      return {
        ...state,
        room: state.rooms[state.players[action.payload].room],
      };
    case "MATCH":
      return { ...state, match: action.payload };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    default:
      return state;
  }
};

const initialState: state = {
  isConnected: false,
  rooms: {},
  player: {},
  players: {},
  room: {},
  messages: [],
  match: {},
};

const GameContext = React.createContext(initialState);

const GameProvider = (props: any) => {
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

    socket.on("PlayerUpdate", (players: any) => {
      dispatch({ type: "PLAYERS", payload: players });
      dispatch({ type: "PLAYER", payload: players[socket.id] });
    });

    socket.on("ReceiveMessage", (receivedMessage) => {
      dispatch({ type: "ADD_MESSAGE", payload: receivedMessage });
    });

    socket.on("RoomsUpdate", (rooms) => {
      dispatch({ type: "ROOMS", payload: rooms });
      dispatch({ type: "ROOM", payload: socket.id });
    });

    socket.on("MatchUpdate", (match) => {
      dispatch({ type: "MATCH", payload: match });
    });

    socket.open();
  }, []);

  return (
    <GameContext.Provider value={state}>{props.children}</GameContext.Provider>
  );
};

const sendMessage = (message: string) => {
  socket.emit("SendMessage", { message });
};

const createRoom = () => {
  socket.emit("CreateRoom");
};

const leaveRoom = () => {
  socket.emit("LeaveRoom");
};

const joinRoom = (roomId: string) => {
  socket.emit("JoinRoom", { roomId });
};

const gameLoaded = () => {
  socket.emit("GameLoaded");
};

let lastType: string | undefined = undefined;
const sendKey = (type: string, key: string) => {
  if (lastType !== type) {
    lastType = type;
    socket.emit("SendKey", { type, key });
  }
};

export {
  GameContext,
  GameProvider,
  createRoom,
  gameLoaded,
  joinRoom,
  leaveRoom,
  sendKey,
  sendMessage,
};
