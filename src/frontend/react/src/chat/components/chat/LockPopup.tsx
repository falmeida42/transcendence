import { useState } from "react";
import { useApi } from "../../../apiStore";
import { updateChatRooms } from "../../context/ChatContext";

interface LockPopupProps {
  isVisible: boolean;
  handleClose: () => void;
  channelId: string;
}

const LockPopup: React.FC<LockPopupProps> = (props: LockPopupProps) => {
  const [chatData, setChatData] = useState<Data>();
  const [inputPassword, setInputPassword] = useState("");
  const [placeholder, setPlaceHolder] = useState("Password");
  const [isVisibleWarning, setIsVisibleWarning] = useState<boolean>(false);
  const [warningText, setWarningText] = useState("This field is mandatory");
  const { login } = useApi();

  interface Participant {
    id: string;
    login: string;
    image: string;
    chatRoomId: string | null;
  }

  interface Data {
    participants: Participant[];
  }
  const tk = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  fetch(`http://localhost:3000/user/chatRoom/${props.channelId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tk}`,
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
      if (data) {
        // console.log("Room info received ", JSON.stringify(data));
        setChatData(data);
      } else {
        console.log("No data received");
      }
    })
    .catch((error) => console.error("Fetch error:", error));

  const handleClickClose = () => {
    props.handleClose();
  };

  const handleClickYes = () => {
    if (inputPassword === "") {
      toggleVisibility(true);
      return;
    }
    const tk = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    fetch(`http://localhost:3000/user/update-room-privacy/${props.channelId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tk}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "PROTECTED",
        password: inputPassword,
      }),
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
          console.log("Room updated", JSON.stringify(data));
        } else {
          console.log("No data received");
        }
      })
      .then(updateChatRooms)
      .catch((error) => console.error("Fetch error:", error));
    props.handleClose();
  };

  const toggleVisibility = (visibility: boolean) => {
    setIsVisibleWarning(visibility);
  };

  const handleInputChangePassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputPassword(event.target.value);
  };

  return (
    <div>
      {props.isVisible && (
        <div className="modal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Protect Chat</h5>
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
                  <p>Add a password to the chatroom:</p>
                  <input
                    className="password-input"
                    type="password"
                    maxLength={12}
                    onClick={() => {
                      setPlaceHolder(""), toggleVisibility(false);
                    }}
                    onBlur={() => setPlaceHolder("Password")}
                    value={inputPassword}
                    onChange={handleInputChangePassword}
                    placeholder={placeholder}
                  />
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

export default LockPopup;
