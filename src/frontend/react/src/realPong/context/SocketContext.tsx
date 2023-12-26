import React, { useEffect, useReducer } from "react";
import { io } from "socket.io-client";

type action = {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
};

type state = {
  isConnected: boolean;
};
const initialState: state = {
  isConnected: false,
};

const socket = io("http://localhost:3000/gamer", { autoConnect: false });

const SocketContext = React.createContext(initialState);

const reducer = (state: state, action: action) => {
  switch (action.type) {
    case "CONNECTED":
      return { ...state, isConnected: action.payload };
    case "DISCONNECTED":
      return { ...state, isConnected: action.payload };
    default:
      return state;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SocketProvider = (props: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    socket.on("connect", () => {
      dispatch({ type: "CONNECTED", payload: true });
    });
    socket.on("disconnect", () => {
      dispatch({ type: "DISCONNECTED", payload: false });
    });
  }, []);

  return (
    <SocketContext.Provider value={state}>
      {props.children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
