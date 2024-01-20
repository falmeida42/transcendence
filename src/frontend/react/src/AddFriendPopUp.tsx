import { useEffect, useState } from "react";
import "./Profile.css";
import { updateUserFriends } from "./ProfileContext";
import { useApi } from "./apiStore";

interface AddFriendPopupProps {
  isVisible: boolean;
  handleClose: () => void;
  token: string;
}

interface User {
  id: string;
  username: string;
  userImage: string;
}

const AddFriendPopup: React.FC<AddFriendPopupProps> = ({
  isVisible,
  handleClose,
  token,
}) => {
  const [userToAdd, setUserToAdd] = useState<User>({
    id: "",
    username: "",
    userImage: "",
  });
  const [users, setUsers] = useState<User[]>([]);
  const [warningText, setWarningText] = useState("This field is mandatory");
  const [isVisibleWarning, setIsVisibleWarning] = useState<boolean>(false);
  const { id, auth } = useApi();

  useEffect(() => {
    if (auth === false) return;
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
        // console.log("YOUR NON_FRIENDS ", data)
        return data ? JSON.parse(data) : null;
      })
      .then((data) => {
        if (!data) return;
        const mappedUsers = data.map((user: any) => ({
          id: user.id,
          username: user.username,
          userImage: user.image,
        }));

        setUsers([...mappedUsers]);
      })
      .catch((error) => console.error("Fetch error:", error));
  }, [updateUserFriends]);

  const toggleVisibility = (visibility: boolean) => {
    setIsVisibleWarning(visibility);
  };

  const handleRadioChange = (user: User) => {
    setUserToAdd(user);
    toggleVisibility(false);
  };

  const handleClickClose = () => {
    setUserToAdd({ id: "", username: "", userImage: "" });
    handleClose();
  };

  const handleClickYes = () => {
    if (userToAdd?.username === "") {
      setWarningText("This field is mandatory");
      toggleVisibility(true);
      return;
    }

    fetch(`http://localhost:3000/user/create-friend-request`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requesterId: id,
        requesteeId: userToAdd.id,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          // throw new Error(`HTTP error! Status: ${response.status}`);
          return console.log("fetch error");
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
      .catch((error) => console.log("Fetch error:", error));
    handleClickClose();
  };

  return (
    <div>
      {isVisible && (
        <div className="modal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add a Friend</h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleClickClose}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div>
                <div className="modal-body">
                  <p>Select a user from the list:</p>
                  <ul className="popup-input">
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
                  {isVisibleWarning && (
                    <p style={{ color: "red" }}>{warningText}</p>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-clear"
                    onClick={handleClickYes}
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleClickClose}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddFriendPopup;
