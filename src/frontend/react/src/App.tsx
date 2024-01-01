import { useEffect } from "react";
import "./App.css";
import Bars from "./Bars.tsx";
import Chat from "./Chat.tsx";
import Profile from "./Profile.tsx";
import { useHashStore } from "./hashStore.tsx";
// import { useApi } from "./apiStore.tsx";
import ApiDataProvider from "./ApiDataProvider.tsx";
import Home from "./realPong/components/Home.tsx";
import { SocketProvider } from "./realPong/context/SocketContext.tsx";

function App() {
  const { showHash } = useHashStore();
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      useHashStore.getState().togglehash(hash);
    };
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <div>
      <ApiDataProvider>
        <Bars />
        {showHash === "#Game" && (
          <div className="game" style={{ padding: "none", height: "80vh" }}>
            <SocketProvider>
              <Home />
            </SocketProvider>
          </div>
        )}
        {showHash === "#Profile" && (
          <div className="game">
            <Profile />
          </div>
        )}
        {showHash === "#Chat" && (
          <div className="game">
            <Chat />
          </div>
        )}
      </ApiDataProvider>
    </div>
  );
}

export default App;
