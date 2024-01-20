import { useApi } from "../../../apiStore";


interface MessageProps {
    username: string;
    image: string
    text: string;
}


const Message = (messageProps : MessageProps) => {
    
    const { user } = useApi()

    
    
    return (
        <div>
            <div className={`${messageProps.username === user ? "float-right" : ""}`}>
                <img src={messageProps.image} />
                <p>{messageProps.username}</p>
            </div>
            <div className={`message ${messageProps.username === user ? "other-message float-right" : "my-message "}`}>
                
                {messageProps.text}     
            </div>
        </div>
    )
}

export default Message