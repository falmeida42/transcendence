import { useState } from "react";
import { useApi } from "../../../apiStore";

interface CreateRoomPopupProps {
    isVisible: boolean;
    handleClose: () => void;
  }

const CreateRoomPopup: React.FC<CreateRoomPopupProps> = ({ isVisible, handleClose }) => {

    const [placeholder, setPlaceHolder] = useState("Name");
    const [modal, setModal] = useState(1);
    const {friends} = useApi()

    console.log("my friends ", friends)

    const handleClickClose = () => {
        handleClose();
    };

    const handleClickYes = () => {
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
                                <li>
                                    <label><input type="checkbox" name="name" ></input></label>
                                </li>
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-clear" onClick={handleClickYes}>Continue</button>
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