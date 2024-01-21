import { useState } from "react";
import { navigate } from "wouter/use-location";
import { updateBlockableUsers, updateUserFriends } from "./ProfileContext";
import { test } from "./chat/context/ChatContext";

interface NotifProps {
  requestor_image: string;
  requestor_username: string;
  requestor_id: string;
  id: string;
}

const Notif: React.FC<NotifProps> = (props) => {
  const [isVisible, setIsVisible] = useState(true);

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  if (token === undefined) return;
  // console.log(token);

  const acceptRequest = (requestor_id: string, id: string) => {
    if (requestor_id !== "" && id !== "") {
      fetch("http://localhost:3000/user/handle-friend-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          requesterId: requestor_id,
          requestId: id,
          type: "ACCEPTED",
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            if (response.status === 401) {
              navigate("/login");
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.text();
          return data ? JSON.parse(data) : null;
        })
        .then(() => {
          updateUserFriends();
        })
        .then(() => {
          test();
        })
        .then(() => {
          updateBlockableUsers();
        })
        .catch((error) => console.error("Fetch error:", error));
    }
    setIsVisible(!isVisible);
  };

  const rejectRequest = (requestor_id: string, id: string) => {
    if (requestor_id !== "" && id !== "") {
      fetch("http://localhost:3000/user/handle-friend-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          requesterId: requestor_id,
          requestId: id,
          type: "CANCELED",
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            if (response.status === 401) {
              navigate("/login");
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.text();
          return data ? JSON.parse(data) : null;
        })
        .then((data) => {
          console.log("CANCELED:", JSON.stringify(data));
        })
        .then(updateUserFriends)
        .catch((error) => console.error("Fetch error:", error));
    }
    setIsVisible(!isVisible);
  };

  return (
    <div>
      {isVisible && (
        <li className="request-item" key={props.requestor_id}>
          <img src={props.requestor_image} className="mr-2" alt="#"></img>
          <p className="mr-2">
            Friend request from <strong>{props.requestor_username}</strong>
          </p>
          <i
            onClick={() => acceptRequest(props.requestor_id, props.id)}
            className="fa fa-check mr-2"
          ></i>
          <i
            onClick={() => rejectRequest(props.requestor_id, props.id)}
            className="fa fa-times mr-2"
          ></i>
        </li>
      )}
    </div>
  );
};

export default Notif;
