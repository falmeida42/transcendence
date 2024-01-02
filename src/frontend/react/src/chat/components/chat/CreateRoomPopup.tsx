import { useState } from "react";
import { useApi } from "../../../apiStore";

interface CreateRoomPopupProps {
    isVisible: boolean;
    handleClose: () => void;
  }

const CreateRoomPopup: React.FC<CreateRoomPopupProps> = ({ isVisible, handleClose }) => {

    const [placeholder, setPlaceHolder] = useState("Name");
    const [inputName, setInputName] = useState("");
    const [inputImage, setInputImage] = useState("");
    const [checkboxValues, setCheckboxValues] = useState<string[]>([]);
    const [modal, setModal] = useState(1);
    const {friends} = useApi()

    console.log("my friends ", friends)

    const handleInputChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputName(event.target.value);
    };

    const handleInputChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputImage(event.target.value);
    };

    const handleCheckboxChange = (value: string) => {
        const isChecked = checkboxValues.includes(value);
    
        if (isChecked) {
          setCheckboxValues(prevValues => prevValues.filter(item => item !== value));
        } else {
          setCheckboxValues(prevValues => [...prevValues, value]);
        }
      };

    const handleClickClose = () => {
        handleClose();
    };

    const handleClickYes = () => {
        if (modal === 1)
        {
            // handle name
            console.log("Chat name: ", inputName);

        } else if (modal === 2) {
            // handle image
            console.log("Chat image: ", inputImage);

        } else if (modal === 3) {
            // handle users
            console.log('Selected values: ', checkboxValues);

            // send to backend
            handleClose();
        }
        setModal(modal + 1);
    };

    return (
            <div>
                {isVisible && (
                <div className="modal">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create New Chatroom</h5>
                        <button type="button" className="close" onClick={handleClickClose}>
                        <span>&times;</span>
                        </button>
                    </div>
                    {modal === 1 && <div>
                        <div className="modal-body">
                            <p>Please insert a name:</p>
                            <input
                            className="popup-input"
                            type="text"
                            onClick={() => setPlaceHolder("")}
                            onBlur={() => setPlaceHolder("Name")}
                            value={inputName}
                            onChange={handleInputChangeName}
                            placeholder={placeholder} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-clear" onClick={handleClickYes}>Continue</button>
                            <button type="button" className="btn btn-secondary" onClick={handleClickClose}>Cancel</button>
                        </div>
                    </div>
                    }
                    {modal === 2 && <div>
                        <div className="modal-body">
                            <p>Please insert an image:</p>
                            <input
                            className="popup-input"
                            type="file"
                            accept="image/*"
                            value={inputImage}
                            onChange={handleInputChangeImage}
                             />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-clear" onClick={handleClickYes}>Continue</button>
                            <button type="button" className="btn btn-secondary" onClick={handleClickClose}>Cancel</button>
                        </div>
                    </div>
                    }
                    {modal === 3 && <div>
                        <div className="modal-body">
                            <p>Please select at least another participant:</p>
                            <ul
                            className="popup-input">
                                { 
                                    friends.map((friend) => (
                                    <li>
                                        <label>
                                            <input 
                                            type="checkbox" 
                                            name="name" 
                                            value={friend.login}
                                            onChange={() => handleCheckboxChange(friend.login)}
                                            />
                                            <img src={friend.image}></img>
                                                {friend.login}
                                        </label>
                                    </li>
                                    ))
                                }
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-clear" onClick={handleClickYes}>Submit</button>
                            <button type="button" className="btn btn-secondary" onClick={handleClickClose}>Cancel</button>
                        </div>
                    </div>
                    }
                    </div>
                </div>
                </div>
                )}
            </div>
    )
}

export default CreateRoomPopup;