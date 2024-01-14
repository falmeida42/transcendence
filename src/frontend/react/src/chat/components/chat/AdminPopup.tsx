import { useEffect, useState } from "react";
import { tk } from "../../context/ChatContext";
import { useApi } from "../../../apiStore";

interface AdminPopupProps {
    isVisible: boolean;
    handleClose: () => void;
    channelId: string;
  }

const AdminPopup: React.FC<AdminPopupProps> = (props: AdminPopupProps) => {

    const [chatData, setChatData] = useState<Participant[]>([]);
    const [userToInvite, setUserToInvite] = useState<Participant>({id: "", login: "", image: "", chatRoomId: ""});
    const [isVisibleWarning, setIsVisibleWarning] = useState<boolean>(false);
    const [warningText, setWarningText] = useState("This field is mandatory");
    const { login } = useApi();

    interface Participant {
        id: string;
        login: string;
        image: string;
        chatRoomId: string | null;
    }


    const handleClickClose = () => {
        props.handleClose();
    };

    const handleClickYes = async () => {
        console.log("handle yes: ", userToInvite)
        console.log("handle yes: ", props.channelId)
        console.log("handle yes: ", userToInvite.id)
        console.log("handle yes: ", userToInvite.login)
        if (userToInvite.login === "") {
           

            toggleVisibility(true);
            return;
        }

         // Set User as Admin
         fetch('http://localhost:3000/user/add-admin', {
            method: "POST",
            headers: {
                Authorization: `Bearer ${tk}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chatId: props.channelId,
                userId: userToInvite.id,
            }),
        })
        .then((data) => {
            console.log("Admin added: ", JSON.stringify(data));
            // Handle success, e.g., update component state
            // You may also want to display a success message to the user
        })
        .catch((error) => {
            console.error("Fetch error:", error);
            // Handle error, e.g., display an error message to the user
        });

        // send to backend
        props.handleClose();
    };

    const toggleVisibility = (visibility: boolean) => {
        setIsVisibleWarning(visibility);
    };

    const handleRadioChange = (data: Participant) => {
        setUserToInvite(data);
        toggleVisibility(false);
    };

    fetch(`http://localhost:3000/user/channelParticipants/${props.channelId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tk}`,
        "Content-Type": "application/json",
      }
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
            const participants = data.result.map((participant : any) => ({
                id: participant.id,
                login: participant.login,
                image: participant.image,
                chatRoomId: participant.chatRoomId,
              }));
              
          setChatData(participants);
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
                        <h5 className="modal-title">Appoint New Admin</h5>
                        <button type="button" className="close" onClick={handleClickClose}>
                        <span>&times;</span>
                        </button>
                    </div>
                    { chatData.length !== 0 && <div>
                         <div className="modal-body">
                            <p>Select a user to give administrator rights to:</p>
                            <ul className="popup-input">
                            {
                                    chatData.map((data) => (
                                        login !== data.login && (
                                            <li>
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
                                    ))
                                }
                            </ul>
                            {isVisibleWarning && <p style={{color: "red"}}>{warningText}</p>}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-clear" onClick={handleClickYes}>Submit</button>
                            <button type="button" className="btn btn-secondary" onClick={handleClickClose}>Cancel</button>
                        </div>
                    </div>}
                    { chatData.length === 0 && 
                        <p style={{color: "red", padding: "25px"}}>You don't have participants to promote</p>}
                                  
                    </div>
                </div>
                </div>
                )}
            </div>
    )
}

export default AdminPopup;