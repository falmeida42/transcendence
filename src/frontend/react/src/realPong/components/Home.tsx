import { useContext, useEffect, useState } from "react";
import { useApi } from "../../apiStore";
import {
  SocketContext,
  createRoom,
  joinQueue,
  leaveQueue,
  leaveRoom,
  set_name,
} from "../context/SocketContext";
import "../game.css";
import RealPong from "./RealPong";

const Home = () => {
  const { isConnected, room, username, onQueue, rooms, match } =
    useContext(SocketContext);
  const [page, setPage] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const { user } = useApi();

  useEffect(() => {
    const changePage = () => {
      if (!isConnected) {
        setPage(0);
        return;
      }
      if (!username) {
        set_name(user);
        setPage(2);

        // setPage(1);
        return;
      }
      if (onQueue) {
        setPage(2);
        return;
      }
      if (!room) {
        setPage(3);
        return;
      }

      if (!match) {
        setPage(4);
        return;
      }

      setPage(5);
    };
    changePage();
  }, [isConnected, room, username, onQueue, rooms, user, match]);

  if (page === 0) {
    return (
      <div>
        <h1>Connecting...</h1>
      </div>
    );
  }

  if (page === 1) {
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

  if (page === 2)
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

          <h1 style={{ color: "#FFF" }}>Waiting...</h1>
        </div>
      </div>
    );

  if (page === 3) {
    return (
      <div className="home">
        <div className="game-buttons">
          <button onClick={() => createRoom(true)}>Play against AI</button>
          <button onClick={() => joinQueue()}>Play a random</button>
          <button onClick={() => createRoom(false)}>
            Play against a friend
          </button>
        </div>
      </div>
    );
  }

  if (page === 4) {
    return (
      <div className="home">
        <button onClick={() => leaveRoom()}>Leave Room</button>
        <h1 style={{ color: "#FFF" }}>Wating for the friend to join...</h1>
      </div>
    );
  }

  if (page === 5) return <RealPong setPage={setPage} />;
};

export default Home;
