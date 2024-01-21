import { useContext, useState } from "react";
import { navigate } from "wouter/use-location";
import "./Profile.css";
import {
  ProfileContext,
  updateBlockableUsers,
  updateUserFriends,
} from "./ProfileContext";
import { useApi } from "./apiStore";
import { test } from "./chat/context/ChatContext";

interface BlockPopupProps {
  isVisible: boolean;
  handleClose: () => void;
}

interface User {
  id: string;
  username: string;
  userImage: string;
}

const BlockPopup: React.FC<BlockPopupProps> = ({ isVisible, handleClose }) => {
  const [userToBlock, setUserToBlock] = useState<User>({
    id: "",
    username: "",
    userImage: "",
  });
  const [warningText, setWarningText] = useState("This field is mandatory");
  const [isVisibleWarning, setIsVisibleWarning] = useState<boolean>(false);
  const { auth } = useApi();
  const { blockableUsers } = useContext(ProfileContext) ?? {};

  const toggleVisibility = (visibility: boolean) => {
    setIsVisibleWarning(visibility);
  };

  const handleRadioChange = (user: User) => {
    setUserToBlock(user);
    toggleVisibility(false);
  };

  const handleClickClose = () => {
    setUserToBlock({ id: "", username: "", userImage: "" });
    handleClose();
  };

  const handleClickYes = () => {
    // console.log("USER TO BLOCK:", userToBlock)
    if (userToBlock?.username === "") {
      setWarningText("This field is mandatory");
      toggleVisibility(true);
      return;
    }
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (auth === false || token === undefined) return;
    // console.log("BLOCK REQUEST: DATA PASSED TO THE BACKEND", id, userToBlock.id);
    fetch(`http://10.12.8.6:3000/user/block-user`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        blockedId: userToBlock.id,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 401) {
            navigate("/login");
          }
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
      .then(() => test())
      .catch((error) => console.error("Fetch error:", error));
    handleClickClose();
  };

  return (
    <div>
      {isVisible && (
        <div className="modal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Block a user</h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleClickClose}
                >
                  <span>&times;</span>
                </button>
              </div>
              {blockableUsers?.length !== 0 && (
                <div>
                  <div className="modal-body">
                    <p>Select a user from the list to block:</p>
                    <ul className="popup-input">
                      {blockableUsers.map((user: User) => (
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
              )}
              {blockableUsers?.length === 0 && (
                <p style={{ color: "red", padding: "25px" }}>
                  There are no eligible users to block
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockPopup;
