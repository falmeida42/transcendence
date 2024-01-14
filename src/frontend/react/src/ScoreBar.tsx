import { useEffect, useState } from "react";
import { useApi } from "./apiStore";

const ScoreBar = () => {
    
    const[wins, setWin] = useState<number>(0);
    const[loses, setLoses] = useState<number>(0);
    const { id } = useApi();

    const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
    if (token === undefined) return;

    const getScore = async () => {
        fetch(`http://localhost:3000/user/matches-wins/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
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
            setWin(data.winsCount);
            setLoses(data.lossesCount);
          })
      .catch((error) => console.error("Fetch error:", error));
    }

    useEffect(() => {
        getScore();
    }, [])

    const percentage = (wins / (wins + loses)) * 100;

    const componentStyle = {
    width: `${percentage}%`,
};


    return (
        <div className="user_progress_bar">
            <h2>
                <span className="skill">Match results (wins | losses)<span className="info_valume"></span></span>
                <div className="progress skill-bar">
                    <div className="progress-bar progress-bar-animated progress-bar-striped" role="progressbar" style={{width: `${percentage}%`}}> <h5 style={{ textAlign: 'right', color: 'white', paddingRight: '4%', marginLeft: '-20px' }}>{wins}</h5>
                    </div>
                    <h5 style={{ lineHeight: "30px", paddingLeft: '3%', marginRight: '-39px' }}>{loses}</h5 >
                </div>
            </h2>
        </div>
)}

export default ScoreBar;