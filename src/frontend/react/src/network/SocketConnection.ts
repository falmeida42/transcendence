import io from "socket.io-client";

export const socketConnection = io("http://localhost:3000", {
  withCredentials: true
});

export var sessionId: string;

socketConnection.on('connect', function() {
    sessionId = socketConnection.id;
    console.log(`userSocketId ${sessionId}`); 
});

