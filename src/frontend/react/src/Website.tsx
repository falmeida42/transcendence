import "./App.css";
import Bars from "./Bars.tsx";
import Profile from "./Profile.tsx";
// import { useApi } from "./apiStore.tsx";
import { Route, Switch, useParams } from "wouter";
import ApiDataProvider from "./ApiDataProvider.tsx";
import FriendProfile from "./FriendProfile.tsx";
import { ProfileProvider } from "./ProfileContext.tsx";
import Chat from "./chat/Chat.tsx";
import { ChatProvider } from "./chat/context/ChatContext.tsx";
import Home from "./realPong/components/Home.tsx";
import { SocketProvider } from "./realPong/context/SocketContext.tsx";

function Website() {
  return (
    <div>
      {/* <ApiData2faProvider/> */}
      <ApiDataProvider />
      <ProfileProvider>
        <SocketProvider>
          <ChatProvider>
            <Bars />
            <Switch>
              <Route path="/Game">
                <div className="game">
                  <Home />
                </div>
              </Route>
              <Route path="/Profile">
                <div className="game">
                  <Profile />
                </div>
              </Route>
              <Route path="/Profile/:login">
                <div className="game">
                  <FriendProfilePage />
                </div>
              </Route>
              <Route path="/Chat">
                <div className="game">
                  <Chat />
                </div>
              </Route>
            </Switch>
          </ChatProvider>
        </SocketProvider>
      </ProfileProvider>
    </div>
  );
}

export default Website;

const FriendProfilePage = () => {
  const { login } = useParams();

  if (login !== undefined) {
    return <FriendProfile login={login} />;
  }
};
