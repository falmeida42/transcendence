interface BlockPopupProps {
  isVisible: boolean;
  handleClose: () => void;
}

const BlockPopup: React.FC<BlockPopupProps> = ({ isVisible, handleClose }) => {
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
                <h5 className="modal-title">Block User</h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleClickClose}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Do you want to block this user?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
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
      )}
    </div>
  );
};

export default BlockPopup;
