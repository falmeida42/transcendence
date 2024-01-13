import { useState, useEffect } from "react";
import { updateUserFriends } from './ProfileContext';
import Notif from "./Notif";

interface NotifListProps {
    
}

interface FriendRequest {
    id: string;
    requestor_id: string;
    requestor_username: string;
    requestor_image: string;
}

const NotifList: React.FC<NotifListProps> = () => {

const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];
if (token === undefined)
    return;
console.log(token);

useEffect(() => {

    fetch(`http://localhost:3000/user/friend-requests`, {
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
            const data = await response.json();
            return data as FriendRequest[]; 
        })
        .then((data) => {
            console.log("FR Return: ", data);
            const mappedRequests = data.map((request: any) => ({
                id: request.id,
                requestor_id: request.requestor.id,
                requestor_username: request.requestor.login,
                requestor_image: request.requestor.image
            }));

            setFriendRequests([...mappedRequests]);
        })
        .catch((error) => console.error("Fetch error:", error));

}, []);

const acceptRequest = (requestor_id: string, id: string) =>
{
    if (requestor_id !== "" && id !== "")
    {
      fetch('http://localhost:3000/user/handle-friend-request', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(
                {
                    requesterId: requestor_id,
                    requestId: id,
                    type: "ACCEPTED"
                }
              ),
            })
            .then(async (response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.text();
            return data ? JSON.parse(data) : null;
            })
            .then((data) => {
                console.log("ACCEPTED:", JSON.stringify(data))
            })
            .then( updateUserFriends )
            .catch((error) => console.error("Fetch error:", error));
        };
}

const rejectRequest = (requestor_id: string, id: string) =>
{
    if (requestor_id !== "" && id !== "")
    {
      fetch('http://localhost:3000/user/handle-friend-request', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(
                {
                    requesterId: requestor_id,
                    requestId: id,
                    type: "CANCELED"
                }
              ),
            })
            .then(async (response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.text();
            return data ? JSON.parse(data) : null;
            })
            .then((data) => {
                console.log("CANCELED:", JSON.stringify(data))
            })
            .then( updateUserFriends )
            .catch((error) => console.error("Fetch error:", error));
        };
}


return (
    <div className="request-container">
        <ul className="request-list">
            {
                friendRequests.map((request: FriendRequest) => (
                    <Notif requestor_id={request.requestor_id} requestor_image={request.requestor_image} 
                    requestor_username={request.requestor_username} id={request.id}></Notif>
                ))
            }
        </ul>
    </div>
)}

export default NotifList;