/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useReducer } from "react";
import { io } from "socket.io-client";

type action = {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
};

type state = {
  isConnected: boolean;
  username?: string;
};

const initialState: state = {
  isConnected: false,
  username: undefined,
};

const socket = io("http://localhost:3000/gamer", { autoConnect: false });

const SocketContext = React.createContext(initialState);

const reducer = (state: state, action: action) => {
  switch (action.type) {
    case "CONNECTED":
      return { ...state, isConnected: action.payload };
    case "DISCONNECTED":
      return { ...state, isConnected: action.payload };
    case "SET_USERNAME":
      return { ...state, username: action.payload };
    default:
      return state;
  }
};

let setUsername: (username: string) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SocketProvider = (props: any) => {
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
  }, [state]);

  setUsername = (username: string) => {
    dispatch({ type: "SET_USERNAME", payload: username });
    socket.open();
  };

  return (
    <SocketContext.Provider value={state}>
      {props.children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider, setUsername };
