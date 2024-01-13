import { useEffect, useState } from "react";
import { useApi } from "./apiStore";
import "./Profile.css"
import { updateUserFriends } from "./ProfileContext";

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
    const [users, setUsers] = useState<User[]>([])
    const [warningText, setWarningText] = useState("This field is mandatory");
    const [isVisibleWarning, setIsVisibleWarning] = useState<boolean>(false);
    const { id } = useApi();
 
    useEffect(() => {
    fetch(`http://localhost:3000/user/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.text();
        return data ? JSON.parse(data) : null;
      })
      .then((data) => {
        const filteredUsers = data.filter((user: any) => user.id !== id);
        const mappedUsers = filteredUsers.map((user : any) => ({
            id: user.id,
            username: user.login,
            userImage: user.image
        }));

        setUsers([...mappedUsers])
      })
      .catch((error) => console.error("Fetch error:", error));
    }, [updateUserFriends]);

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

        console.log("USER TO BLOCK:", userToBlock)
        if (userToBlock?.username === "")
        {
            setWarningText("This field is mandatory");
            toggleVisibility(true);
            return;
        }

        console.log("BLOCK REQUEST: DATA PASSED TO THE BACKEND", id, userToBlock.id);
        fetch(`http://localhost:3000/user/create-friend-request`, {
                method: "POST",
                headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        requesterId : id,
                        requesteeId : userToBlock.id
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
                console.log("Request sent status: ", JSON.stringify(data));
                } else {
                console.log("No data received");
                }
            })
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
                               {users.map((user) => (
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