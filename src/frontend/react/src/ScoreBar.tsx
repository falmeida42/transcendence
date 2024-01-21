import { useEffect, useState } from "react";
import { navigate } from "wouter/use-location";

interface props {
  id: string;
}

const ScoreBar = ({ id }: props) => {
  const [wins, setWin] = useState<number>(0);
  const [losses, setLosses] = useState<number>(0);

  const getScore = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      if (token === undefined || id == undefined || id === "") return;

      const response = await fetch(
        `http://10.12.8.6:3000/user/matches-wins/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        if (!response.ok) {
          if (response.status === 401) {
            navigate("/login");
          }
        }
      }
      const data = await response.json();
      setWin(data.winsCount);
      setLosses(data.lossesCount);
    } catch {}
  };

  useEffect(() => {
    getScore();
  }, [id]);

  const percentage =
    losses > 0 || wins > 0 ? (wins / (wins + losses)) * 100 : 50;

  const componentStyle = {
    width: `${percentage}%`,
  };

  return (
    <div className="user_progress_bar">
      <h2>
        <span className="skill">
          Match results (wins | losses)<span className="info_valume"></span>
        </span>
        <div className="progress skill-bar">
          <div
            className="progress-bar progress-bar-animated progress-bar-striped"
            role="progressbar"
            style={{ width: `${percentage}%` }}
          >
            {" "}
            <h5
              style={{
                textAlign: "right",
                color: "white",
                paddingRight: "4%",
                marginLeft: "-20px",
              }}
            >
              {wins}
            </h5>
          </div>
          <h5
            style={{
              lineHeight: "30px",
              paddingLeft: "3%",
              marginRight: "-39px",
            }}
          >
            {losses}
          </h5>
        </div>
      </h2>
    </div>
  );
};

export default ScoreBar;
