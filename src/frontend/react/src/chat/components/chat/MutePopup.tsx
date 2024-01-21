import { useState } from "react";
import { navigate } from "wouter/use-location";
import { useApi } from "../../../apiStore";

interface MutePopupProps {
  isVisible: boolean;
  handleClose: () => void;
  channelId: string;
}

const MutePopup: React.FC<MutePopupProps> = (props: MutePopupProps) => {
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
    //send to backend
    const tk = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    // console.log(props.channelId);

    fetch(`http://localhost:3000/user/mute-user`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tk}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId: props.channelId,
        participantId: userToInvite.id,
        duration: "1",
      }),
    })
      .then(async (response) => {
        const data = await response.text();
        return data ? JSON.parse(data) : null;
      })
      .then((data) => {
        if (!data) {
          console.log("No data received");
        }
        // console.log(data);
      })
      .catch(() => {
        console.log("cu");
      });
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
                <h5 className="modal-title">Mute User</h5>
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
                  <p>Select a user to mute temporarily:</p>
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
                        )
                    )}
                  </ul>
                  {isVisibleWarning && (
                    <p style={{ color: "red" }}>{warningText}</p>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    Mute
                    User
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

export default MutePopup;
