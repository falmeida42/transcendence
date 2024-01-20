import { useEffect, useState } from "react";
import { test } from "../../context/ChatContext";

interface BanPopupProps {
  isVisible: boolean;
  handleClose: () => void;
  channelId: string;
}

const BanPopup: React.FC<BanPopupProps> = (props: BanPopupProps) => {
  const [chatData, setChatData] = useState<Participant[]>();
  const [userToInvite, setUserToInvite] = useState<Participant>({
    id: "",
    login: "",
    image: "",
    chatRoomId: "",
    username: "",
  });
  const [isVisibleWarning, setIsVisibleWarning] = useState<boolean>(false);
  const [warningText, setWarningText] = useState("This field is mandatory");
  const [kickError, setKickError] = useState(false);

  interface Participant {
    id: string;
    login: string;
    username: string;
    image: string;
    // chatRoomId: string | null;
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
    const tk = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (tk === undefined) return;
    fetch(`http://localhost:3000/user/ban-user`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tk}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId: props.channelId,
        participantId: userToInvite.id,
      }),
    })
      .then((response) => response.text())
      .then(() => test(userToInvite.id))
      .catch((error) => {
        console.error("Error: ", error);
        setKickError(true);
      });

    //send to backend
    props.handleClose();
  };

  const toggleVisibility = (visibility: boolean) => {
    setIsVisibleWarning(visibility);
  };

  const handleRadioChange = (data: Participant) => {
    setUserToInvite(data);
    toggleVisibility(false);
  };

  useEffect(() => {
    const tk = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (tk === undefined) return;
    fetch(`http://localhost:3000/user/can-kick?roomId=${props.channelId}`, {
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
          const mappedParticipants = data.map((participant: Participant) => ({
            id: participant.id,
            username: participant.username,
            login: participant.login,
            image: participant.image,
          }));
          setChatData([...mappedParticipants]);
        } else {
          console.log("No data received");
        }
      });
  }, []);

  return (
    <div>
      {props.isVisible && (
        <div className="modal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Ban User</h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleClickClose}
                >
                  <span>&times;</span>
                </button>
              </div>
              {!kickError && chatData?.length !== 0 && (
                <div>
                  <div className="modal-body">
                    <p>Select a user to ban permanently from the chatroom:</p>
                    <ul className="popup-input">
                      {chatData?.map((data: Participant) => (
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
              {chatData?.length === 0 && (
                <p style={{ color: "red", padding: "25px" }}>
                  There are no eligible participants to ban
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BanPopup;
