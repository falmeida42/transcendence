import Usetwofa from "./Apiturnon";
import ApiQr from "./ApiQr";
import { useApi } from "./apiStore";

function Qrcode() {
    const {email, qrcode} = useApi();

    return (
        <div>
                <ApiQr />
                <img src={qrcode}></img>
            <Usetwofa code={""} />
        </div>
    )
}

export default Qrcode;