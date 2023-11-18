import Play from "../../assets/Play.png"

const Input = () => {
    return (
        <div className="input">
            <input type="text" placeholder="Type something..."/>
            <div className="send">
                <img src={Play} alt="" />
                <button>Send</button>
            </div>
        </div>
    )
}

export default Input