import { useContext } from "react";
import { navigate } from "wouter/use-location";
import { useApi } from "../../../apiStore";
import {
  declinedInvite,
  joinRoomInvite,
} from "../../../realPong/context/SocketContext";
import { ChatContext } from "../../context/ChatContext";

interface MessageProps {
  id: string;
  senderId: string;
  username: string;
  image: string;
  text: string;
  type: boolean;
}

const Message = (messageProps: MessageProps) => {
  const { user } = useApi();
  const { socket } = useContext(ChatContext) ?? {};

  const handleClickAccept = (myUsername: string, messageUsername: string) => {
    if (myUsername === messageUsername) return;
    navigate("/Game");
    joinRoomInvite(messageProps.senderId);
    socket.emit("deleteMessage", { messageId: messageProps.id });
  };
  const handleClickDecline = (myUsername: string, messageUsername: string) => {
    if (myUsername === messageUsername) return;
    socket.emit("deleteMessage", { messageId: messageProps.id });
    declinedInvite(messageProps.senderId);
  };

  return (
    <div>
      <div className={`${messageProps.username === user ? "float-right" : ""}`}>
        <img src={messageProps.image} />
        <p>{messageProps.username}</p>
      </div>
      <div
        className={`message ${
          messageProps.username === user
            ? "other-message float-right"
            : "my-message "
        }`}
      >
        {messageProps.text}
        {messageProps.type && (
          <>
            <button
              onClick={() => handleClickAccept(user, messageProps.username)}
              className="btn btn-success"
              style={{ marginLeft: "10px" }}
            >
              Accept
            </button>
            <button
              onClick={() => handleClickDecline(user, messageProps.username)}
              className="btn btn-danger"
              style={{ marginLeft: "10px" }}
            >
              Decline
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Message;
