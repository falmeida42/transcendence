import { useEffect, useState } from "react";
// import { sendMessage } from "./contexts/gameContext";

interface chatProps {
  sendMessage: (message: string) => void;
  messages: string[];
}

export const Chat = (props: chatProps) => {
  const [messageToSend, setMessageToSend] = useState("");

  const sendMessage = () => {
    if (!messageToSend.trim()) return;
    props.sendMessage(messageToSend);
    setMessageToSend("");
  };

  useEffect(() => {
    const elem = document.getElementById("chat-content");
    if (elem) {
      elem.scrollTop = elem.scrollHeight;
    }
  }, [props.messages]);

  return (
    <div className="chat-container">
      <div id="chat-content" className="chat-content">
        {props.messages.join("\n\n")}
      </div>
      <div className="chat-form">
        <input
          type="text"
          value={messageToSend}
          onChange={(e) => setMessageToSend(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button disabled={!messageToSend.trim()} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};
