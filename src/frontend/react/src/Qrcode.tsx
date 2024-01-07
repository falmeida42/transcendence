import Usetwofa from "./Apiturnon";
import ApiQr from "./ApiQr";
import { useApi } from "./apiStore";

function Qrcode() {
    const {email, qrcode} = useApi();

    return (
        <div>
            <ul className="list-unstyled">
                <li><i className="fa fa-envelope-o"></i> : {email}</li>
                <ApiQr />
                <img src={qrcode}></img>
            </ul>
            <Usetwofa code={""} />
        </div>
    )
}

export default Qrcode;