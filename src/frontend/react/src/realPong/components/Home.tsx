import { useContext, useEffect, useState } from "react";
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
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    console.log("page changer");
    console.log({
      isConnected,
      username,
      onQueue,
      room,
    });
    const changePage = () => {
      if (!isConnected) {
        setPage(0);
        return;
      }
      if (!username) {
        setPage(1);
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
      setPage(5);
    };
    changePage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, room, username, onQueue]);

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

          <h1>Waiting...</h1>
        </div>
      </div>
    );

  if (page === 3) {
    return (
      <div>
        <button onClick={() => createRoom(true)}>Play against AI</button>
        <button onClick={() => joinQueue()}>Play a random</button>
      </div>
    );
  }

  if (page === 5) return <RealPong setPage={setPage} />;
};

export default Home;
