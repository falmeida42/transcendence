interface MatchPopupProps {
    isVisible: boolean;
    handleClose: () => void;
  }

const MatchPopup: React.FC<MatchPopupProps> = ({ isVisible, handleClose }) => {

    const handleClickClose = () => {
        handleClose();
    };

    const handleClickYes = () => {
        handleClose();
    }; 

    return (
            <div>
                {isVisible && (
                <div className="modal">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Challenge User</h5>
                        <button type="button" className="close" onClick={handleClickClose}>
                        <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Do you want to challenge this user to a match of Pong?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={handleClickYes}>Yes</button>
                        <button type="button" className="btn btn-secondary" onClick={handleClickClose}>No</button>
                    </div>
                    </div>
                </div>
                </div>
                )}
            </div>
    )
}

export default MatchPopup;