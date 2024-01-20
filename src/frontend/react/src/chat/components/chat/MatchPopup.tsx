import { useState } from "react";
import { useApi } from "../../../apiStore";

interface MatchPopupProps {
  isVisible: boolean;
  handleClose: () => void;
  channelId: string;
}

const MatchPopup: React.FC<MatchPopupProps> = (props: MatchPopupProps) => {
  const [chatData, setChatData] = useState<Data>();
  const [userToInvite, setUserToInvite] = useState<Participant>({
    id: "",
    login: "",
    image: "",
    chatRoomId: "",
  });
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

  const handleClickClose = () => {
    props.handleClose();
  };

  const handleClickYes = () => {
    if (userToInvite.login === "") {
      toggleVisibility(true);
      return;
    }
    //send invite to user: component <MatchInvite />
    // console.log("Sending invite to user: ", userToInvite.login);
    props.handleClose();
  };

  const toggleVisibility = (visibility: boolean) => {
    setIsVisibleWarning(visibility);
  };

  const handleRadioChange = (data: Participant) => {
    setUserToInvite(data);
    toggleVisibility(false);
  };
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

  return (
    <div>
      {props.isVisible && (
        <div className="modal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Challenge User</h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleClickClose}
                >
                  <span>&times;</span>
                </button>
              </div>
                { chatData?.participants.length !== 1 && (
              <div>
                  <div className="modal-body">
                  <p>Select a user to challenge to a match of Pong:</p>
                  <ul className="popup-input">
                    {chatData?.participants.map(
                      (data) =>
                        login !== data.login && (
                          <li key={data.id}>
                            <label>
                              <input
                                type="radio"
                                value="public"
                                name="group"
                                onChange={() => handleRadioChange(data)}
                                />
                              <img src={data.image}></img>
                              {data.login}
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
                    Send Invite
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
            </div>
          </div>
        </div>
      )}
      {chatData?.participants.length === 1 && (
          <p style={{ color: "red", padding: "25px" }}>
                  There are no eligible participants to invite
          </p>
      )}
    </div>
  );
};

export default MatchPopup;
