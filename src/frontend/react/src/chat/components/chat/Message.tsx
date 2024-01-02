

interface MessageProps {
    username: string;
    text: string;
}


const Message = (messageProps : MessageProps) => {
    

    console.log(`Message received: ${messageProps.text}`)
    console.log( "username: ", messageProps.username)
    
    
    return (
        <div className={`message ${messageProps.username === messageProps.username ? "other-message float-right" : "my-message "}`}>
                {messageProps.text}     
        </div>
    )
}

export default Message