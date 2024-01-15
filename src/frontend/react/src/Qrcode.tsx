import Usetwofa from "./Apiturnon";
import ApiQr from "./ApiQr";
import { useApi } from "./apiStore";
import { useEffect } from "react";

interface QrCodeProps {
    handleClose: () => void;
}

const Qrcode: React.FC<QrCodeProps> = ({handleClose}) => {
    const {email, qrcode, auth} = useApi();
    useEffect(() => {},[auth]);

    return (
        <div style={{display:"flex", justifyContent:"center", flexDirection:"column"}}>
             <p>Scan the QR Code with the Authenticator app and introduce the resulting code to enable 2FA</p>      
                <ApiQr />
                <img style={{width:"100%"}} src={qrcode}></img>
            <Usetwofa handleClose={handleClose} code={""} />
        </div>
    )
}

export default Qrcode;