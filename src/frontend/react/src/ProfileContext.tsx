import { createContext, ReactNode, useState, useEffect, useRef } from "react";
import { navigate } from "wouter/use-location";
import { useApi } from "./apiStore";

interface ProfileContextProps {
  userFriends: any,
  blockableUsers: any
}

interface ProfileProviderProps {
  children: ReactNode;
}

interface User {
	id: string,
	username: string,
	userImage: string,
  userLogin: string,
}

const ProfileContext = createContext<ProfileContextProps | undefined>(undefined);

let updateUserFriends: () => void;
let updateBlockableUsers: () => void;

function ProfileProvider({ children }: ProfileProviderProps) {
    
    const [userFriends, setUserFriends] = useState<User[]>([])
    const [blockableUsers, setBlockableUsers] = useState<User[]>([])
    const {auth} = useApi();
    
    const tk = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];
  
  updateUserFriends = () => {
    if (auth === false) return;

    fetch(`http://localhost:3000/user/friends`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tk}`,
        "Content-Type": "application/json",
      },
    })
    .then(async (response) => {
        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login');
          }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.text();
        return data ? JSON.parse(data) : null;
    })
    .then((data) => {
        const mappedFriends = data.map((friend: any) => ({
            id: friend.id,
            username: friend.username,
            userImage: friend.image,
            userLogin: friend.login,
        }));
        
        setUserFriends([...mappedFriends]);
    })
    .catch((error) => console.error("Fetch error:", error));

  }

  updateBlockableUsers = () => {

    fetch(`http://localhost:3000/user/blockable-users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tk}`,
        "Content-Type": "application/json",
      },
    })
    .then(async (response) => {
        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login');
          }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.text();
        return data ? JSON.parse(data) : null;
    })
    .then((data) => {
        const mappedBlockableUsers = data.map((friend: any) => ({
            id: friend.id,
            username: friend.username,
            userImage: friend.image,
        }));
        
        setBlockableUsers(mappedBlockableUsers);
    })
    .catch((error) => console.error("Fetch error:", error));

  }

  useEffect(() => {
    const tk = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];
    if (auth === false || tk === undefined) return;

    fetch(`http://localhost:3000/user/friends`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tk}`,
        "Content-Type": "application/json",
      },
    })
    .then(async (response) => {
        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login');
          }
        }
        const data = await response.text();
        return data ? JSON.parse(data) : null;
    })
    .then((data) => {
        const mappedFriends = data.map((friend: any) => ({
            id: friend.id,
            username: friend.username,
            userImage: friend.image,
            userLogin: friend.login,
        }));
        
        setUserFriends([...mappedFriends]);
    })
    .catch((error) => console.error("Fetch error:", error));

    fetch(`http://localhost:3000/user/blockable-users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tk}`,
        "Content-Type": "application/json",
      },
    })
    .then(async (response) => {
        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login');
          }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.text();
        return data ? JSON.parse(data) : null;
    })
    .then((data) => {
        const mappedBlockableUsers = data.map((friend: any) => ({
            id: friend.id,
            username: friend.username,
            userImage: friend.image,
        }));
        
        setBlockableUsers([...mappedBlockableUsers]);
    })
    .catch((error) => console.error("Fetch error:", error));

  }, [auth, ProfileContext]);


  const contextValue: ProfileContextProps = {
    userFriends: userFriends,
    blockableUsers: blockableUsers
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}

export { ProfileContext, ProfileProvider, updateUserFriends, updateBlockableUsers };