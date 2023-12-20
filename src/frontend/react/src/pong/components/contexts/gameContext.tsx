import React, { useEffect, useReducer } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000/game", { autoConnect: false });

type action = {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
};

type state = {
  isConnected: boolean;
  players: object;
  messages: string[];
};

const reducer = (state: state, action: action) => {
  switch (action.type) {
    case "CONNECTED":
      return { ...state, isConnected: action.payload };
    case "DISCONNECTED":
      return { ...state, isConnected: action.payload };
    case "PLAYERS":
      return { ...state, players: action.payload };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    default:
      return state;
  }
};

const initialState: state = {
  isConnected: false,
  players: {},
  messages: [],
};

const GameContext = React.createContext(initialState);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // setIsConnected(false);
    });

    socket.on("PlayerUpdate", (players) => {
      dispatch({ type: "PLAYERS", payload: players });
      // setPlayers(players);
    });

    socket.on("receiveMessage", (receivedMessage) => {
      dispatch({ type: "ADD_MESSAGE", payload: receivedMessage });
      // setMessages(messages + receivedMessage + "\n\n");
    });

    socket.open();
  }, []);

  useEffect(() => {
    dispatch({ type: "", payload: "" });
  }, []);

  return (
    <GameContext.Provider value={state}>{props.children}</GameContext.Provider>
  );
};

const sendMessage = (message: string) => {
  socket.emit("sendMessage", { message });
};

const createRoom = () => {
  socket.emit('CreateRoom')
}

export { GameContext, GameProvider, sendMessage, createRoom };
