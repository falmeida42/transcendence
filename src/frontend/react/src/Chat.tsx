import {useState, useRef} from 'react';

function Chat() {
    const [searchFieldValue, setSearchFieldValue] = useState('Search contacts...');
    const [sendMessageValue, setSendMessageValue] = useState('Send message...');
    const [showChat, setShowChat] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState<{
        name: string;
        email: string;
        imageSrc: string;
      } | null>(null);
    const floatingImgRef = useRef<HTMLElement | null>(null);

    
    const handleSearchFocus = () => {
    if (searchFieldValue === 'Search contacts...') {
            setSearchFieldValue('');
        }
    };

    const handleSearchBlur = () => {
    if (searchFieldValue === '') {
        setSearchFieldValue('Search contacts...');
        }
    };

    const handleSendMessageFocus = () => {
    if (sendMessageValue === 'Send message...') {
          setSendMessageValue('');
        }
    };
    
    const handleSendMessageBlur = () => {
    if (sendMessageValue === '') {
          setSendMessageValue('Send message...');
        }
    };

    const handleFriendClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        console.log("HELLO2");
        const friendElement = event.currentTarget as HTMLDivElement;

        if (!friendElement) {
          return; // Handle the case where friendElement is null or undefined
        }
      
        const childOffset = friendElement.offsetTop;
      
        const parentElement = friendElement.parentNode as HTMLElement | null;
        const parentOffset = parentElement?.parentNode instanceof HTMLElement
          ? parentElement.parentNode.offsetTop
          : 0;
      
        const childTop = childOffset - parentOffset;
        const top = childTop + 12 + "px";
      
        const friendClone = friendElement.querySelector('img');
        if (!friendClone) {
          return; // Handle the case where friendClone is null or undefined
        }
      
        const clone = friendClone.cloneNode(true) as HTMLElement;
      
        const profileElement = document.getElementById("profile");
        const profileParagraphElement = document.getElementById("profile p");
        const chatMessagesElement = document.getElementById("chat-messages");
        const friendsListElement = document.getElementById('friendslist');
        const chatViewElement = document.getElementById('chatview');
        const closeButton = document.getElementById('close');

        if (profileElement && profileParagraphElement && chatMessagesElement &&
          friendsListElement && chatViewElement && closeButton) {
          setTimeout(() => {
            profileElement.classList.add("animate");
            profileParagraphElement.classList.add("animate");
          }, 100);
      
          setTimeout(() => {
            chatMessagesElement.classList.add("animate");
            document.querySelectorAll('.cx, .cy').forEach((el) => el.classList.add('s1'));
            setTimeout(() => document.querySelectorAll('.cx, .cy').forEach((el) => el.classList.add('s2')), 100);
            setTimeout(() => document.querySelectorAll('.cx, .cy').forEach((el) => el.classList.add('s3')), 200);
          }, 150);
      
    
          floatingImgRef.current?.animate?.(
            [
              { width: "68px", left: "108px", top: "20px" },
            ],
            { duration: 200, fill: "both" }
          );
      
          const name = friendElement.querySelector("p strong")?.innerHTML;
          const email = friendElement.querySelector("p span")?.innerHTML;
          
          if (name && email) {
            profileParagraphElement.innerHTML = name;
            const profileSpan = document.getElementById("profile span");
            if (profileSpan) {
              profileSpan.innerHTML = email;
            }
          }
      
          document.querySelectorAll(".message:not(.right) img").forEach((img) => img.setAttribute("src", friendClone.src));
          friendsListElement.style.display = 'none';
          chatViewElement.style.display = 'block';
      
          closeButton.addEventListener("click", handleCloseClick);
      
          // Update state to show the chat and store the selected friend
          setShowChat(true);
          setSelectedFriend({
            name: name || '',
            email: email || '',
            imageSrc: friendClone.src,
          });
        }
      };
    
      const handleCloseClick = () => {
        const chatMessagesElement = document.getElementById("chat-messages");
        const profileElement = document.getElementById("profile");
        const profileParagraphElement = document.getElementById("profile p");
        const friendsListElement = document.getElementById('friendslist');
        const chatViewElement = document.getElementById('chatview');
      
        if (chatMessagesElement && profileElement && profileParagraphElement &&
          friendsListElement && chatViewElement) {
          chatMessagesElement.classList.remove("animate");
          profileElement.classList.remove("animate");
          profileParagraphElement.classList.remove("animate");
          document.querySelectorAll('.cx, .cy').forEach((el) => el.classList.remove("s1", "s2", "s3"));
      
          if (floatingImgRef.current) {
            floatingImgRef.current.animate(
              [
                { width: "40px", top: floatingImgRef.current.style.top, left: "12px" },
              ],
              { duration: 200, fill: "both" }
            );
            setTimeout(() => {
              if (floatingImgRef.current) {
                floatingImgRef.current.remove();
              }
            }, 200);
          }
      
          setTimeout(() => {
            chatViewElement.style.display = 'none';
            friendsListElement.style.display = 'block';
          }, 50);
      
          // Update state to hide the chat
          setShowChat(false);
          setSelectedFriend(null);
        }
      };
    
    return (
        <div id="chatbox">
        <div id="friendslist">
            <div id="topmenu">
                <span className="friends"></span>
                    <span className="chats"></span>
                    <span className="history"></span>
                </div>
                
                <div id="friends">
                <div className="friend" onClick={handleFriendClick}>
                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/1_copy.jpg" />
                        <p>
                        <strong>Miro Badev</strong>
                        <span>mirobadev@gmail.com</span>
                        </p>
                        <div className="status available"></div>
                    </div>
                    
                    <div className="friend" onClick={handleFriendClick}>
                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/2_copy.jpg" />
                        <p>
                        <strong>Martin Joseph</strong>
                        <span>marjoseph@gmail.com</span>
                        </p>
                        <div className="status away"></div>
                    </div>
                    
                    <div className="friend" onClick={handleFriendClick}>
                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/3_copy.jpg" />
                        <p>
                        <strong>Tomas Kennedy</strong>
                        <span>tomaskennedy@gmail.com</span>
                        </p>
                        <div className="status inactive"></div>
                    </div>
                    
                    <div className="friend" onClick={handleFriendClick}>
                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/4_copy.jpg" />
                        <p>
                        <strong>Enrique Sutton</strong>
                        <span>enriquesutton@gmail.com</span>
                        </p>
                        <div className="status inactive"></div>
                    </div>
                    
                    <div className="friend" onClick={handleFriendClick}>
                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/5_copy.jpg" />
                        <p>
                        <strong>  Darnell Strickland</strong>
                        <span>darnellstrickland@gmail.com</span>
                        </p>
                        <div className="status inactive"></div>
                    </div>
                    
                    <div id="search">
                    <input 
                        type="text" 
                        id="searchfield" 
                        onFocus={handleSearchFocus} 
                        onBlur={handleSearchBlur} 
                        value={searchFieldValue} />
                    </div>
                    
                </div>                
                
            </div>  
            

            {showChat && selectedFriend && (
            <div id="chatview" className="p1">      
                <div id="profile">

                    <div id="close" onClick={handleCloseClick}>
                        <div className="cy"></div>
                        <div className="cx"></div>
                    </div>
                    
                    <p>{selectedFriend.name}</p>
                    <span>{selectedFriend.email}</span>
                </div>
                <div id="chat-messages">
                <label>Thursday 02</label>
                    
                    <div className="message">
                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/1_copy.jpg" />
                        <div className="bubble">
                        Really cool stuff!
                            <div className="corner"></div>
                            <span>3 min</span>
                        </div>
                    </div>
                    
                    <div className="message right">
                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/2_copy.jpg" />
                        <div className="bubble">
                        Can you share a link for the tutorial?
                            <div className="corner"></div>
                            <span>1 min</span>
                        </div>
                    </div>
                    
                    <div className="message">
                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/1_copy.jpg" />
                        <div className="bubble">
                        Yeah, hold on
                            <div className="corner"></div>
                            <span>Now</span>
                        </div>
                    </div>
                    
                    <div className="message right">
                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/2_copy.jpg" />
                        <div className="bubble">
                        Can you share a link for the tutorial?
                            <div className="corner"></div>
                            <span>1 min</span>
                        </div>
                    </div>
                    
                    <div className="message">
                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/1_copy.jpg" />
                        <div className="bubble">
                        Yeah, hold on
                            <div className="corner"></div>
                            <span>Now</span>
                        </div>
                    </div>
                    
                </div>
            
                <div id="sendmessage">
                <input 
                    type="text" 
                    value="Send message..." 
                    onFocus={handleSendMessageFocus}
                    onBlur={handleSendMessageBlur}/>
                    <button id="send"></button>
                </div>
            </div>
            )}
        </div>
    );
}

export default Chat;