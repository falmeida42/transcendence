import { useEffect } from "react";

interface props {
  id: string;
}

const MatchHistory = ({ id }: props) => {
  useEffect(() => {
    const callBitches = async () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      if (token === undefined) return;

      const response = await fetch(
        `http://localhost:3000/user/matches/${133015}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        return;
      }

      const data = await response.json();
      console.log(JSON.stringify(data));
    };

    callBitches();
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
          <li>
            <span>
              <img
                src="images/layout_img/msg2.png"
                className="img-responsive"
                alt="#"
              ></img>
            </span>
            <span>
              <span className="name_user">Win against Taison Jack</span>
              <span className="msg_user">11-4</span>
              <span className="time_ago">12 min ago</span>
            </span>
          </li>
          <li>
            <span>
              <img
                src="images/layout_img/msg3.png"
                className="img-responsive"
                alt="#"
              ></img>
            </span>
            <span>
              <span className="name_user">Loss against Mike John</span>
              <span className="msg_user">1-7</span>
              <span className="time_ago">12 min ago</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MatchHistory;
