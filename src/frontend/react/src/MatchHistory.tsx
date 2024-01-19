import { useEffect, useState } from "react";
import { navigate } from "wouter/use-location";

interface User {
  id: string;
  image: string;
  username: string;
  login: string;
}

interface Match {
  id: string;
  winner: User;
  loser: User;
  playerWinScore: number;
  playerLosScore: number;
  createdAt: Date;
}

const handleNavigate = (friendId: string) => {
  navigate(`/Profile/${friendId}`);
};

interface props {
  id: string;
}

const MatchHistory = ({ id }: props) => {
  const [matchHistory, setMatchHistory] = useState<Match[]>([]);

  const getMatchHistory = async () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (token === undefined || id === undefined || id === "") return;

    fetch(`http://localhost:3000/user/matches/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 401) {
            navigate("/login");
          }
        }
        const data = await response.text();
        return data ? JSON.parse(data) : null;
      })
      .then((data) => {
        // console.log("MATCH DATA:", data);
        const mappedHistory = data.map((match: any) => ({
          id: match.id,
          winner: match.winner,
          loser: match.loser,
          playerWinScore: match.playerwinScore,
          playerLosScore: match.playerlosScore,
          createdAt: match.createdAt,
        }));
        setMatchHistory([...mappedHistory]);
      })
      .catch((error) => console.error("Fetch error:", error));
  };

  useEffect(() => {
    getMatchHistory();
  }, [id]);

  return (
    <div
      className="tab-pane fade show active"
      id="recent_activity"
      role="tabpanel"
      aria-labelledby="nav-home-tab"
    >
      <div className="msg_list_main">
        <ul className="msg_list">
          {matchHistory.map((match: Match) => (
            <li key={match.id}>
              <span>
                <a
                  onClick={() => {
                    handleNavigate(match.winner.login);
                  }}
                >
                  <img
                    src={match.winner.image}
                    className="img-responsive"
                    title={`See the ${match.winner.login} profile`}
                    alt="#"
                  ></img>
                </a>
              </span>
              <span>
                {match.winner.id === id ? (
                  <span className="name_user" style={{ color: "green" }}>
                    Won against {match.loser.username}
                  </span>
                ) : (
                  <span className="name_user" style={{ color: "red" }}>
                    Lost against {match.winner.username}
                  </span>
                )}
                <span className="msg_user">
                  {match.playerWinScore}-{match.playerLosScore}
                </span>
                <span className="time_ago">
                  {new Date(match.createdAt).toLocaleDateString()}{" "}
                  {new Date(match.createdAt).toLocaleTimeString()}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MatchHistory;
