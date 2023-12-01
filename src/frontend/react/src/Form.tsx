
const Form = () => {
    return (
        <form className="form">
            <label>
                Name:
                <input type="text" name="name"/>
            </label>
            <input type="submit" value="submit"/>
        </form>
    )
}

export default Form