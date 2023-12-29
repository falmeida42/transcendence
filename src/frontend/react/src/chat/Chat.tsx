import {useState, useRef} from 'react';

import "./Chat.scss"
import ChatContent from './components/chat/ChatContent';
import ChatSidebar from './components/sidebar/ChatSidebar';
import { ChatContext, ChatProvider } from './context/ChatContext';


function Chat() {

    return (
      <div className="container_chat clearfix">
        <ChatProvider>
          <ChatSidebar/>
          <ChatContent/>
        </ChatProvider>
      </div>
    );
}

export default Chat;