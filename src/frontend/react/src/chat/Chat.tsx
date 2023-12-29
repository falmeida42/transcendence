import {useState, useRef} from 'react';

import "./Chat.scss"
import ChatContent from './components/chat/ChatContent';
import ChatSidebar from './components/sidebar/ChatSidebar';


function Chat() {

    return (
      <div className="container container_chat clearfix">
        <ChatSidebar/>
        <ChatContent/>
      </div>
    );
}

export default Chat;