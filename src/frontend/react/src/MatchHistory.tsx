import { useEffect, useState } from "react";
import { useApi } from "./apiStore";

interface User {
  id: string,
  image: string,
  username: string
}

interface Match {
  id: string,
  winner: User,
  loser: User,
  playerWinScore: number,
  playerLosScore: number,
  createdAt: Date
}

interface props {
  id: string;
}

const MatchHistory = ({ id }: props) => {

  const[matchHistory, setMatchHistory] = useState<Match[]>([])

  
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  if (token === undefined || id === undefined) return;

  const getMatchHistory = async () => {
    fetch(`http://localhost:3000/user/matches/${id}`, {
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
      console.log("MATCH DATA:", data);
      const mappedHistory = data.map((match: any) => ({
        id: match.id,
        winner: match.winner,
        loser: match.loser,
        playerWinScore: match.playerwinScore,
        playerLosScore: match.playerlosScore,
        createdAt: match.createdAt
      }));
      setMatchHistory([...mappedHistory]);
  })
  .catch((error) => console.error("Fetch error:", error));
}

  useEffect(() => {
    getMatchHistory();
  },[id])

  return (
    <div
      className="tab-pane fade show active"
      id="recent_activity"
      role="tabpanel"
      aria-labelledby="nav-home-tab"
    >
      <div className="msg_list_main">
        <ul className="msg_list">
          {
            matchHistory.map((match: Match) => (
              <li key={match.id}>
                <span>
                  <img
                    src={match.winner.image}
                    className="img-responsive"
                    alt="#"
                  ></img>
                </span>
                <span>
                  {match.winner.id === id ? (
                    <span className="name_user">Win against {match.loser.username}</span>
                  ) : <span className="name_user">Loss against {match.winner.username}</span>
                  }
                  <span className="msg_user">{match.playerWinScore}-{match.playerLosScore}</span>
                  <span className="time_ago">
                    {new Date(match.createdAt).toLocaleDateString()}{' '}
                    {new Date(match.createdAt).toLocaleTimeString()}
                  </span>
                </span>  
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
};

export default MatchHistory;
