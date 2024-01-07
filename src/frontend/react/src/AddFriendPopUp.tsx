import { useEffect, useState } from "react";

interface AddFriendPopupProps {
    isVisible: boolean;
    handleClose: () => void;
  }
  
  interface User {
	id: string,
	username: string,
	userImage: string
}


const AddFriendPopup: React.FC<AddFriendPopupProps> = ({ isVisible, handleClose }) => {

    const [userToAdd, setUserToAdd] = useState<User>({id: "", username: "", userImage: ""});
    const [users, setUsers] = useState<User[]>([])
    const [warningText, setWarningText] = useState("This field is mandatory");
    const [isVisibleWarning, setIsVisibleWarning] = useState<boolean>(false);

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    useEffect(() => {
    fetch(`http://localhost:3000/user/not-friends`, {
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
        const mappedUsers = data.map((user : any) => ({

            id: user.id,
            username: user.login,
            userImage: user.image
        }));

        setUsers([...mappedUsers])
      })
      .catch((error) => console.error("Fetch error:", error));
    }, []);

    console.log(users);
    console.log("is visible: ", isVisible)

    const toggleVisibility = (visibility: boolean) => {
        setIsVisibleWarning(visibility);
    };

    const handleRadioChange = (user: User) => {
        setUserToAdd(user);
        toggleVisibility(false);
    };

    const handleClickClose = () => {
        handleClose();
    };

    const style = {
		zIndex: 999,
	}

    const handleClickYes = () => {

        if (userToAdd?.username === "")
        {
            setWarningText("This field is mandatory");
            toggleVisibility(true);
            return;
        }

        // fetch Post add friend

        

    };

    return (
            <div>
                {isVisible && (
                <div className="pop" style={style}>
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add a Friend</h5>
                        <button type="button" className="close" onClick={handleClickClose}>
                        <span>&times;</span>
                        </button>
                    </div>
                    <div>
                        <div className="modal-body">
                            <p>Select a user from the list:</p>
                            <ul
                            className="popup-input"
                            style={{padding: "4px 0"}}
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

export default AddFriendPopup;