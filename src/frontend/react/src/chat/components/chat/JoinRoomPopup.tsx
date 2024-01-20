import { useEffect, useState } from "react";
import { useApi } from "../../../apiStore";
import { test, updateChatRooms } from "../../context/ChatContext";

interface JoinRoomPopupProps {
  isVisible: boolean;
  handleClose: () => void;
}

const JoinRoomPopup: React.FC<JoinRoomPopupProps> = ({
  isVisible,
  handleClose,
}) => {
  const [placeholder, setPlaceHolder] = useState("Password");
  const [roomToJoin, setRoomToJoin] = useState<Channel>({
    id: "",
    name: "",
    image: "",
    type: "",
  });
  const [inputPassword, setInputPassword] = useState("");
  const [warningText, setWarningText] = useState("This field is mandatory");
  const [isVisibleWarning, setIsVisibleWarning] = useState<boolean>(false);
  const [channels, setChannels] = useState([]);
  const { login } = useApi();

  interface Channel {
    id: string;
    name: string;
    image: string;
    type: string;
  }

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    fetch(`http://localhost:3000/user/joinable-rooms`, {
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
        if (data) {
          setChannels(data);
        } else {
          console.log("No data received");
        }
        test();
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  const toggleVisibility = (visibility: boolean) => {
    setIsVisibleWarning(visibility);
  };

  const handleInputChangePassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputPassword(event.target.value);
  };

  const handleRadioChange = (channel: Channel) => {
    setRoomToJoin(channel);
    toggleVisibility(false);
    if (channel.type !== "PROTECTED") setInputPassword("");
  };

  const handleClickClose = () => {
    handleClose();
  };

  const handleClickYes = () => {
    if (roomToJoin?.name === "") {
      setWarningText("This field is mandatory");
      toggleVisibility(true);
      return;
    }

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    fetch(`http://localhost:3000/user/join-room`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: login,
        roomId: roomToJoin.id,
        password: inputPassword,
        roomType: roomToJoin.type,
      }),
    })
      .then(async (response) => {
        console.log("some response received: ", response);
        if (!response.ok) {
          if (response.status == 403) {
            setWarningText("You were banned from this channel");
            toggleVisibility(true);
            return;
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.text();
        return data ? JSON.parse(data) : null;
      })
      .then((data) => {
        if (data) {
          console.log("Join status: ", JSON.stringify(data));
          if (data.success === false) {
            setWarningText("Wrong password");
            toggleVisibility(true);
            setInputPassword("");
          } else if (data.success === true) {
            console.log("sucess handle close");
            handleClose();
          }
        } else {
          console.log("No data received");
        }
      })
      .then(updateChatRooms)
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      {isVisible && (
        <div className="modal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Join a Chatroom</h5>
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
                  <p>Select a room from the list:</p>
                  <ul className="popup-input" style={{ padding: "4px 0" }}>
                    {channels.map((channel) => (
                      <li key={channel.id}>
                        <label>
                          <input
                            type="radio"
                            value="public"
                            name="group"
                            onChange={() => handleRadioChange(channel)}
                          />
                          <img src={channel.image}></img>
                          {channel.name}
                        </label>
                      </li>
                    ))}
                    {roomToJoin?.type === "PROTECTED" && (
                      <label>
                        <input
                          className="popup-input"
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
                      </label>
                    )}
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

export default JoinRoomPopup;
