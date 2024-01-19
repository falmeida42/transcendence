import {useState, useRef} from 'react';

import "./Chat.scss"
import ChatContent from './components/chat/ChatContent';
import ChatSidebar from './components/sidebar/ChatSidebar';
import { ChatProvider } from './context/ChatContext';
import { ChatData } from './components/sidebar/ChatInfo';



function Chat() {

  const [selectedChatData, setSelectedChatData] = useState({id: "", name: "User", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgNOTnGwLPveeC1y6JVb6AN0W9DWkZ8i_7a9BBg720aUQuuQlwOqpOolfhGQDKayNoTHw&usqp=CAU"});

  const passSelectedChatData = (data: ChatData) => {
    setSelectedChatData(data);
  };

  // console.log("Chat:", selectedChatData);
    return (
      <div className="container container_chat clearfix">
          <ChatSidebar passSelectedChatData={passSelectedChatData}/>
          {selectedChatData.id !== "" && <ChatContent selectedChatData={selectedChatData} passSelectedChatData={passSelectedChatData}/>}
      </div>
    );
}

export default Chat;