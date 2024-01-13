
const Form = () => {
    return (
        <form className="form">
            <label>
                Name:
                <input type="text" name="name"/>
            </label>
            <label>
                Room:
                <input type="text" name="room"/>
            </label>
            <input type="submit" value="submit"/>
        </form>
    )
}

export default Form