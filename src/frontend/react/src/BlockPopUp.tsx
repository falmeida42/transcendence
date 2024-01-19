import { useContext, useEffect, useState } from "react";
import { useApi } from "./apiStore";
import "./Profile.css"
import { ProfileContext, updateBlockableUsers, updateUserFriends } from "./ProfileContext";

interface BlockPopupProps {
    isVisible: boolean;
    handleClose: () => void;
    token: string;
  }
  
  interface User {
	id: string,
	username: string,
	userImage: string
}

const BlockPopup: React.FC<BlockPopupProps> = ({ isVisible, handleClose, token }) => {

    const [userToBlock, setUserToBlock] = useState<User>({id: "", username: "", userImage: ""});
    const [warningText, setWarningText] = useState("This field is mandatory");
    const [isVisibleWarning, setIsVisibleWarning] = useState<boolean>(false);
    const { id } = useApi();
    const { blockableUsers } = useContext(ProfileContext) ?? {};
 
    const toggleVisibility = (visibility: boolean) => {
        setIsVisibleWarning(visibility);
    };

    const handleRadioChange = (user: User) => {
        setUserToBlock(user);
        toggleVisibility(false);
    };

    const handleClickClose = () => {
        setUserToBlock({id: "", username: "", userImage: ""})
        handleClose();
    };

    const handleClickYes = () => {

        // console.log("USER TO BLOCK:", userToBlock)
        if (userToBlock?.username === "")
        {
            setWarningText("This field is mandatory");
            toggleVisibility(true);
            return;
        }

        // console.log("BLOCK REQUEST: DATA PASSED TO THE BACKEND", id, userToBlock.id);
        fetch(`http://localhost:3000/user/block-user`, {
                method: "POST",
                headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        blockedId : userToBlock.id
                    }
                )
            })
            .then(async (response) => {
                if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.text();
                return data ? JSON.parse(data) : null;
            })
            .then((data) => {
                if (data) {
                console.log("Block status: ", JSON.stringify(data));
                } else {
                console.log("No data received");
                }
            })
            .then(updateBlockableUsers)
	    .then(updateUserFriends)
            .catch((error) => console.error("Fetch error:", error));
            handleClickClose()
    };

    return (
            <div>
                {isVisible && (
                <div className="modal">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Block a user</h5>
                        <button type="button" className="close" onClick={handleClickClose}>
                        <span>&times;</span>
                        </button>
                    </div>
                    <div>
                        <div className="modal-body">
                            <p>Select a user from the list to block:</p>
                            <ul
                            className="popup-input"
                            >
                               {blockableUsers.map((user) => (
                                <li key={user.id}>
                                    <label>
                                    <input 
                                        type="radio" 
                                        value="public"
                                        name="group"
                                        onChange={() => handleRadioChange(user)}
                                    />
                                    <img src={user.userImage} alt={user.username} />
                                    {user.username}
                                    </label>
                                </li>
                                ))}

                            </ul>
                            {isVisibleWarning && <p style={{color: "red"}}>{warningText}</p>}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-clear" onClick={handleClickYes}>Submit</button>
                            <button type="button" className="btn btn-secondary" onClick={handleClickClose}>Cancel</button>
                        </div>
                    </div>                   
                    </div>
                </div>
                </div>
                )}
            </div>
    )
}

export default BlockPopup;
