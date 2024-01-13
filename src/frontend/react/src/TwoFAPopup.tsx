import { useEffect, useState } from "react";
import { useApi } from "./apiStore";
import "./Profile.css"
import Qrcode from "./Qrcode";
import Apiturnoff from "./Apiturnoff";
import Usetwofa from './Apiturnon';

interface TwoFaPopupProps {
    isVisible: boolean;
    handleClose: () => void;
    token: string;
}


const TwoFaPopup: React.FC<TwoFaPopupProps> = ({ isVisible, handleClose, token }) => {
    const [warningText, setWarningText] = useState("This field is mandatory");
    const [isVisibleWarning, setIsVisibleWarning] = useState<boolean>(false);
    const { id, login, twofa } = useApi();

    const handleClickCode = () => {
        Usetwofa({ handleClose: handleClose, code: login });
    };


    const toggleVisibility = (visibility: boolean) => {
        setIsVisibleWarning(visibility);
    };

    const handleClickClose = () => {
        handleClose();
    };

    const handleClickYes = () => {

        handleClickClose()
    };

    return (
        <div>
            {isVisible && (
                <div className="modal" id="twofa">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Manage 2FA</h5>
                                <button type="button" className="close" onClick={handleClickClose}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {twofa === false && <Qrcode handleClose={handleClose} />}
                                {twofa === true && <Apiturnoff handleClose={handleClose}/>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TwoFaPopup;