import { useContext, useState } from "react";
import {
  SocketContext,
  createRoom,
  joinQueue,
  leaveQueue,
  set_name,
} from "../context/SocketContext";
import RealPong from "./RealPong";

const Home = () => {
  const { isConnected, room, username, onQueue } = useContext(SocketContext);
  const [name, setName] = useState<string>("");

  if (!isConnected) {
    return (
      <div>
        <h1>Connecting...</h1>
      </div>
    );
  }

  if (!username) {
    return (
      <div>
        <input
          type="text"
          name="name"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") set_name(name);
          }}
        />
        <button onClick={() => set_name(name)}>Set Name</button>
      </div>
    );
  }

  if (onQueue)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <button onClick={() => leaveQueue()}>Leave Queue</button>

        <div className="loading">
          <div className="loader"></div>

          <h1>Waiting...</h1>
        </div>
      </div>
    );

  if (!room) {
    return (
      <div>
        <button onClick={() => createRoom(true)}>Play against AI</button>
        <button onClick={() => joinQueue()}>Play a random</button>
        <button disabled>Play with a friend</button>
      </div>
    );
  }

  return <RealPong />;
};

export default Home;
