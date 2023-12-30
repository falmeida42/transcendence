import { useContext, useState } from "react";
import { SocketContext, createRoom, set_name } from "../context/SocketContext";
import RealPong from "./RealPong";

const Home = () => {
  const { isConnected, room, username, match, winner } =
    useContext(SocketContext);
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

  if (!room) {
    return (
      <div>
        <button onClick={() => createRoom(true)}>Play against AI</button>
        <button>Play a random</button>
        <button disabled>Play with a friend</button>
      </div>
    );
  }

  if (!match)
    return (
      <div>
        <h1>Waiting for a match...</h1>
      </div>
    );

  if (winner) return <h1>{winner} ganhou o jogo!</h1>;

  return <RealPong />;
};

export default Home;
