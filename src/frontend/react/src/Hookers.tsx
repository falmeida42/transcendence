import axios from "axios";
import { useEffect, useState } from "react"

const getHookers = (url : string) => {
    const [isLoading, setLoading] = useState(false);
    const [apiData, setApiData] = useState(null);
    const [serverError, setServerError] = useState(null);

    useEffect(()  => {
        setLoading(true)
        const Hookers = async () => {
            try {
                const resp = await axios.get(url)
                const data = await resp?.data
                
                setApiData(data)
                setLoading(false)
            } catch (error) {
                setServerError(error);
                setLoading(false)
            }
        }
        Hookers()
    }, [url])

    return {isLoading, apiData, serverError}
}

export default getHookers;