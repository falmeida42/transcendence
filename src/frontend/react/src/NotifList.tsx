import { useState, useEffect } from "react";


interface NotifListProps {
    
}

interface FriendRequest {
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
				// const data = await response.text();
				// return data ? JSON.parse(data) : null;
                const data = await response.json(); // Use response.json() for parsing JSON
                return data as FriendRequest[]; 
			})
			.then((data) => {
                console.log("FR Return: ", data);
				const mappedRequests = data.map((request: any) => ({
					requestor_id: request.requestor.id,
					requestor_username: request.requestor.login,
                    requestor_image: request.requestor.image
				}));

				setFriendRequests([...mappedRequests]);
			})
			.catch((error) => console.error("Fetch error:", error));

	}, []);


return (
    <div className="">
        <ul className="">
            {
                friendRequests.map((request: FriendRequest) => (
                    <li className="request-item">
                        <img src={request.requestor_image} className="mr-2" alt="#"></img>
                        <p className="mr-2">{request.requestor_username}</p>
                        <i className="fa fa-check mr-1"></i>
                        <i className="fa fa-times"></i>
                    </li>
                ))
            }
        </ul>
    </div>
)}

export default NotifList;
