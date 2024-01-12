import { useEffect } from "react";
import "./App.css";
import Bars from "./Bars.tsx";
import Chat from "./Chat.tsx";
import Profile from "./Profile.tsx";
import { useHashStore } from "./hashStore.tsx";
// import { useApi } from "./apiStore.tsx";
import { Route, Switch } from "wouter";
import ApiDataProvider from "./ApiDataProvider.tsx";
import Home from "./realPong/components/Home.tsx";
import { SocketProvider } from "./realPong/context/SocketContext.tsx";

function Website() {
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
      {/* <ApiData2faProvider/> */}
      <ApiDataProvider />
      <Bars />
      <Switch>
        <Route path="/Game">
          <div className="game">
            <SocketProvider>
              <Home />
            </SocketProvider>
          </div>
        </Route>
        <Route path="/Profile">
          <div className="game">
            <Profile />
          </div>
        </Route>
        <Route path="/Chat">
          <div className="game">
            <Chat />
          </div>
        </Route>
      </Switch>
    </div>
  );
}

export default Website;
