import {useState, useRef} from 'react';

import "./Chat.scss"
import ChatContent from './components/chat/ChatContent';
import ChatSidebar from './components/sidebar/ChatSidebar';
import { ChatContext, ChatProvider } from './context/ChatContext';



function Chat() {

  const [selectedChatData, setSelectedChatData] = useState("");

  const passSelectedChatData = (data: string) => {
    setSelectedChatData(data);
  };

  console.log("Chat:", selectedChatData);
    return (
      <div className="container container_chat clearfix">
        <ChatProvider>
          <ChatSidebar passSelectedChatData={passSelectedChatData}/>
          <ChatContent selectedChatData={selectedChatData}/>
        </ChatProvider>
      </div>
    );
}

export default Chat;