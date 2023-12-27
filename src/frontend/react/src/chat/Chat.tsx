import {useState, useRef} from 'react';

import "./Chat.scss"
import Search from './components/sidebar/Search';
import ChatInfo from './components/sidebar/ChatInfo';
import Input from './components/chat/Input';
import Message from './components/chat/Message';
import Chats from './components/sidebar/Chats';


function Chat() {

    return (
      <div className="container_chat clearfix">
      <div className="sidebar">
        <Search/>
        <Chats/>
      </div>
      
      <div className="chat">
        <div className="chat-header clearfix">
          <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01_green.jpg" alt="avatar" />
          
          <div className="chat-about">
            <div className="chat-with">Chat with Vincent Porter</div>
          </div>
      </div>
        
      <div className="chat-history">
          <ul>
            <li className="clearfix">
              <Message key={crypto.randomUUID()} username={"faalmeida"} text={"Hi Vincent, how are you? How is the project coming along?"}/>
            </li>
          
            <li className="clearfix">
              <Message key={crypto.randomUUID()} username={"falmeida"} text={"Are we meeting today? Project has been already finished and I have results to show you."}/>
            </li>

            <li className="clearfix">
              <Message key={crypto.randomUUID()} username={"falmeida"} text={"Well I am not sure. The rest of the team is not here yet. Maybe in an hour or so? Have you faced any problems at the last phase of the project?"}/>
            </li>
            
            <li className="clearfix">
              <Message key={crypto.randomUUID()} username={"falmeeida"} text={" Actually everything was fine. I'm very excited to show this to our team."}/>
            </li>
            
          </ul>
        </div>  
        <Input/>
      </div> 
    </div>
    );
}

export default Chat;