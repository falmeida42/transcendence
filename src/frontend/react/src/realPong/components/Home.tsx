import { useContext, useEffect, useState } from "react";
import {
  SocketContext,
  createRoom,
  joinQueue,
  leaveQueue,
  set_name,
} from "../context/SocketContext";
import "../game.css";
import RealPong from "./RealPong";

const Home = () => {
  const { isConnected, room, username, onQueue, rooms } =
    useContext(SocketContext);
  const [name, setName] = useState<string>("");
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
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
  }, [isConnected, room, username, onQueue, rooms]);

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
    console.log(JSON.stringify(rooms));
    return (
      <div className="home">
        <div className="rooms-list">
          <ul>
            {rooms?.length === 0 && (
              <li className="room-item">No rooms available</li>
            )}
            {rooms &&
              rooms.map((room) => (
                <li key={room.id} className="room-item">
                  {room.name}
                </li>
              ))}
          </ul>
        </div>
        <div className="game-buttons">
          <button onClick={() => createRoom(true)}>Play against AI</button>
          <button onClick={() => joinQueue()}>Play a random</button>
        </div>
      </div>
    );
  }

  if (page === 5) return <RealPong setPage={setPage} />;
};

export default Home;
