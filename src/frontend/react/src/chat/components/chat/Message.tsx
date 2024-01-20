import { useContext } from "react";
import { useApi } from "../../../apiStore";
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
  const { user, id } = useApi();
  const { socket } = useContext(ChatContext) ?? {};

  const handleClickAccept = (myUsername: string, messageUsername: string) => {
    if (myUsername === messageUsername) return;
    console.log("accept", id, "sender", messageProps.senderId);
    socket.emit("enterGame", {
      player1Id: id,
      player2Id: messageProps.senderId,
    });
  };
  const handleClickDecline = (myUsername: string, messageUsername: string) => {
    if (myUsername === messageUsername) return;
    socket.emit("deleteMessage", { messageId: messageProps.id });
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
