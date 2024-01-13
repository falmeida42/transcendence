import { useApi } from "../../../apiStore";


interface MessageProps {
    username: string;
    image: string
    text: string;
}


const Message = (messageProps : MessageProps) => {
    
    const { login } = useApi()

    console.log(`Message received: ${messageProps.text}`)
    console.log( "username: ", messageProps.username)
    
    
    return (
        <div>
            <div className={`${messageProps.username === login ? "float-right" : ""}`}>
                <img src={messageProps.image} />
                <p>{messageProps.username}</p>
            </div>
            <div className={`message ${messageProps.username === login ? "other-message float-right" : "my-message "}`}>
                
                {messageProps.text}     
            </div>
        </div>
    )
}

export default Message