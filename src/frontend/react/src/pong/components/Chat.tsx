import { useState } from "react";

interface chatProps {
  sendMessage: (message: string) => void;
  messages: string[];
}

export const Chat = (props: chatProps) => {
  const [messageToSend, setMessageToSend] = useState("");

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button>Criar Sala</button>
      <div style={{ whiteSpace: "pre-wrap" }}>
        {props.messages.join("\n\n")}
      </div>
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
