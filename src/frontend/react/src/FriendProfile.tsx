import { useEffect, useState } from "react";
import { navigate } from "wouter/use-location";
import MatchHistory from "./MatchHistory";
import "./Profile.css";
import ScoreBar from "./ScoreBar";
import Friendfriend from "./FriendFriend";

// interface User {
// 	id: string,
// 	userName: string,
// 	userImage: string,
// 	userLogin: string
// 	userFirst_name: string;
// 	userLast_name: string;
// 	userEmail: string;
// }

interface props {
  login: string;
}

const FriendProfile = ({ login }: props) => {
  const [id, setId] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];
        if (token === undefined || login === undefined) return;

        const response = await fetch(
          `http://localhost:3000/user/find/login/${login}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          if (response.status === 401) {
            navigate("/login");
          }
          if (response.status === 404) {
            navigate("/Profile");
          }
          return;
        }

        const data = await response.json();
        setId(data.id);
        setUsername(data.username);
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setEmail(data.email);
        setImage(data.image);
      } catch {}
    };

    fetchData();
  }, [login]);

  return (
    <div className="container-fluid profile_container">
      {/* <AddFriendPopup isVisible={isVisibleAddFriend} handleClose={handleClickAddFriend} token={token}/>
			<TwoFaPopup isVisible={isVisible2FA} handleClose={handleClick2FA} token={token}/>
      <BlockPopup isVisible={isVisibleBlock} handleClose={handleClickBlock} token={token}/>					 */}
      <div className="profile_contant flex-item">
        <div className="form-group">
          <div className="input-group d-flex flex-column">
            <>
              <div className="profile_img">
                <img
                  style={{ maxHeight: 300 }}
                  src={image}
                  alt="Selected"
                  className="rounded-circle"
                />
              </div>
            </>
          </div>
        </div>
      </div>
      <div className="profile_contant flex-item">
        <div className="contact_inner">
          <h3 className="mb-4">
            {first_name} {last_name}
          </h3>
          <div className="">
            <div className="form-group" style={{ marginBottom: "4px" }}>
              <div className="input-group">
                <span className="mr-2" style={{ maxHeight: "20px" }}>
                  <p>
                    <strong>Username: {username}</strong>
                  </p>
                </span>
              </div>
            </div>
          </div>

          <p className="mb-4">
            <i className="fa fa-envelope-o"></i> : {email}
          </p>
          <ScoreBar id={id} />
        </div>
      </div>

      <div className="tabbar">
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <a
              className="nav-item nav-link active"
              id="nav-home-tab"
              data-toggle="tab"
              href="#recent_activity"
              role="tab"
              aria-selected="true"
            >
              Match History
            </a>
            <a className="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#project_worked" role="tab" aria-selected="false">Friend List</a>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <MatchHistory id={id} />
          <div
            className="tab-pane fade"
            id="project_worked"
            role="tabpanel"
            aria-labelledby="nav-home-tab"
          >
            <Friendfriend id={id}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendProfile;
