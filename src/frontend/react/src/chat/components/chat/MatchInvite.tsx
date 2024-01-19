import { useState } from "react";
import { useApi } from "../../../apiStore";

interface MatchInviteProps {
  senderUsername: string;
}

const MatchInvite: React.FC<MatchInviteProps> = (props: MatchInviteProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const { login } = useApi();

  const handleClickClose = () => {
    setIsVisible(!isVisible);
  };

  const handleClickYes = () => {
    //send to backend
    setIsVisible(!isVisible);
  };

  return (
    <div>
      {isVisible && (
        <div className="modal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Challenge Received</h5>
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
                  <p>
                    You have been invited to a match of Pong by{" "}
                    <strong>{props.senderUsername}</strong>. Do you accept?
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-clear"
                    onClick={handleClickYes}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleClickClose}
                  >
                    No
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

export default MatchInvite;
