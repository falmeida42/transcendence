import { useContext, useState } from "react";
import { SocketContext, setUsername } from "./context/SocketContext";

const Home = () => {
  const { isConnected, username } = useContext(SocketContext);
  const [name, setName] = useState<string>("");

  return (
    <>
      {!isConnected && (
        <div className="main-container">
          <input
            name="username"
            type="text"
            placeholder="Type your login"
            onChange={(e) => {
              setName(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && name.trim()) setUsername(name);
            }}
            autoComplete="true"
          />
          <button
            onClick={() => {
              if (!name.trim()) return;
              setUsername(name);
            }}
          >
            Connect
          </button>
        </div>
      )}
      {isConnected && <span>{username}</span>}
    </>
  );
};

export default Home;
