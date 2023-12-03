import { useState } from "react";

interface chatProps {
  sendMessage: (message: string) => void;
}

export const Chat = (props: chatProps) => {
  const [messages, setMessages] = useState("");
  const [messageToSend, setMessageToSend] = useState("");

  return (
    <div style={{ flex: 1 }}>
      <div>{messages}</div>
      <input
        type="text"
        value={messageToSend}
        onChange={(e) => setMessageToSend(e.target.value)}
      />
      <button
        onClick={() => {
          props.sendMessage(messageToSend);
          console.log(messageToSend);
        }}
      >
        Send
      </button>
    </div>
  );
};
