import { useEffect, useState } from "react";
import { navigate } from "wouter/use-location";

interface User {
  id: string;
  image: string;
  username: string;
  login: string;
}

const handleNavigate = (friendId: string) => {
  navigate(`/Profile/${friendId}`);
};

interface props {
  id: string;
}

const Friendfriend = ({ id }: props) => {
  // const [Friendfriend, setFriendfriend] = useState<Match[]>([]);
  const [userFriends, setUserFriends] = useState<User[]>([]);

  const getFriendfriend = async () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (token === undefined || id === undefined || id === "") return;

    fetch(`http://localhost:3000/user/friends/${id}`, {
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
        console.log(data);
        const mappedFriends = data.map((friend: any) => ({
            id: friend.id,
            username: friend.username,
            image: friend.image,
            login: friend.login,
        }));
        
        setUserFriends([...mappedFriends]);
    })
      .catch((error) => console.error("Fetch error:", error));
  };

  useEffect(() => {
    getFriendfriend();
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
                {userFriends.map((friend: User) => (
                  <li key={friend.id}>
                    <span>
                      <a
                        onClick={() => {
                          handleNavigate(friend.login);
                        }}
                      >
                        <img
                          src={friend.image}
                          className="img-responsive"
                          alt="#"
                        ></img>
                      </a>
                    </span>
                    <span>
                      <span className="name_user">{friend.username}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
    </div>
  );
};

export default Friendfriend;
