import { useState } from "react";
import { useApi } from "../../../apiStore";
import { test, tk, updateChatRooms } from "../../context/ChatContext";

interface CreateRoomPopupProps {
    isVisible: boolean;
    handleClose: () => void;
  }

const CreateRoomPopup: React.FC<CreateRoomPopupProps> = ({ isVisible, handleClose }) => {

    const [placeholder, setPlaceHolder] = useState("Name");
    const [inputName, setInputName] = useState("");
    const [inputImage, setInputImage] = useState<string | undefined>("");
    const [inputPassword, setInputPassword] = useState("");
    const [inputPrivacy, setInputPrivacy] = useState<string>("");
    const [checkboxValues, setCheckboxValues] = useState<string[]>([]);
    const [modal, setModal] = useState(1);
    const {friends, login} = useApi();
    const [isVisibleWarning, setIsVisibleWarning] = useState<boolean>(false);

    const toggleVisibility = (visibility: boolean) => {
        setIsVisibleWarning(visibility);
    };

    const handleInputChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputName(event.target.value);
    };

    const handleInputChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputPassword(event.target.value);
    };

    const handleInputChangeImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
    
            reader.onloadend = async () => {
                if (reader.readyState === FileReader.DONE) {
                    const image = new Image();
                    image.src = reader.result as string;
    
                    image.onload = async () => {
                        const canvas = document.createElement('canvas');
                        const maxImageSize = 1024; // Set your maximum image size here
    
                        let width = image.width;
                        let height = image.height;
    
                        if (width > maxImageSize || height > maxImageSize) {
                            const aspectRatio = width / height;
    
                            if (width > height) {
                                width = maxImageSize;
                                height = maxImageSize / aspectRatio;
                            } else {
                                height = maxImageSize;
                                width = maxImageSize * aspectRatio;
                            }
                        }
    
                        canvas.width = width;
                        canvas.height = height;
    
                        const ctx = canvas.getContext('2d');
                        ctx?.drawImage(image, 0, 0, width, height);
    
                        const resizedDataURL = canvas.toDataURL('image/jpeg'); // You can change the format if needed
    
                        setInputImage(resizedDataURL);
                    };
                }
            };
    
            reader.readAsDataURL(file);
        }
    
        toggleVisibility(false);
    };
    
    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputPrivacy(event.target.value);
        setPlaceHolder("Password");
        toggleVisibility(false);
        if (inputPrivacy !== "protected")
            setInputPassword("");
      };

    const handleCheckboxChange = (value: string) => {
        setCheckboxValues([login])
        
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
            if (inputName === "")
            {
                toggleVisibility(true);
                return;
            }
        } else if (modal === 2) {
            if (inputImage === "")
            {
                toggleVisibility(true);
                return;
            }
        } else if (modal === 3) {
            if (inputPrivacy === "" || (inputPrivacy === "protected" && inputPassword === ""))
            {
                toggleVisibility(true);
                return;
            }
        } else if (modal === 4) {
            if (checkboxValues.length === 0)
            {
                toggleVisibility(true);
                return;
            }

            fetch(`http://localhost:3000/user/add-room`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${tk}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    roomdata: {
                        id: crypto.randomUUID().toString(),
                        name: inputName,
                        image: inputImage,
                        type: inputPrivacy,
                        participants: checkboxValues,
                        password: inputPassword
                    }
                })
                })
                .then(() =>
                    test()
                    // updateChatRooms
                )
                .catch((error) => console.error("Fetch error:", error));

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
                            maxLength={12}
                            onClick={() => {
                                setPlaceHolder(""),
                                toggleVisibility(false)
                            }}
                            onBlur={() => setPlaceHolder("Name")}
                            value={inputName}
                            onChange={handleInputChangeName}
                            placeholder={placeholder} />
                            {isVisibleWarning && <p style={{color: "red"}}>This field is mandatory</p>}
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
                            onChange={handleInputChangeImage}
                             />
                            {isVisibleWarning && <p style={{color: "red"}}>This field is mandatory</p>}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-clear" onClick={handleClickYes}>Continue</button>
                            <button type="button" className="btn btn-secondary" onClick={handleClickClose}>Cancel</button>
                        </div>
                    </div>
                    }
                    {modal === 3 && <div>
                        <div className="modal-body">
                            <p>Select the chat's privacy level:</p>
                            <ul
                            className="popup-input"
                            style={{padding: "4px 0"}}
                            >
                            
                                    <li>
                                        <label>
                                            <input 
                                            id="public"
                                            type="radio" 
                                            value="public"
                                            name="group"
                                            onChange={handleRadioChange}
                                            />
                                                public
                                        </label>
                                    </li>
                                    <li>
                                        <label>
                                            <input 
                                            id="private"
                                            type="radio" 
                                            value="private"
                                            name="group"
                                            onChange={handleRadioChange}
                                            />
                                                private
                                        </label>
                                    </li>
                                    <li>
                                        <label>
                                            <input 
                                            id="protected"
                                            type="radio" 
                                            value="protected"
                                            name="group"
                                            onChange={handleRadioChange}
                                            />
                                                password-protected
                                        </label>
                                    </li>
                                    { inputPrivacy === "protected" &&
                                        <label>
                                            <input
                                            className="popup-input"
                                            type="password"
                                            maxLength={12}
                                            onClick={() => {
                                                setPlaceHolder(""),
                                                toggleVisibility(false)
                                            }}
                                            onBlur={() => setPlaceHolder("Password")}
                                            value={inputPassword}
                                            onChange={handleInputChangePassword}
                                            placeholder={placeholder} />
                                        </label>
                                    }
                            </ul>
                            {isVisibleWarning && <p style={{color: "red"}}>This field is mandatory</p>}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-clear" onClick={handleClickYes}>Continue</button>
                            <button type="button" className="btn btn-secondary" onClick={handleClickClose}>Cancel</button>
                        </div>
                    </div>
                    }                   
                    {modal === 4 && <div>
                        <div className="modal-body">
                            <p>Please select at least another participant:</p>
                            <ul
                            className="popup-input">
                                { 
                                    friends.map((friend : any) => (
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
                            {isVisibleWarning && <p style={{color: "red"}}>This field is mandatory</p>}
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