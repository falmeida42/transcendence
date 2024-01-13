import { createContext, ReactNode, useState, useEffect, useRef } from "react";

interface ProfileContextProps {
  userFriends: any,
}

interface ProfileProviderProps {
  children: ReactNode;
}

interface User {
	id: string,
	username: string,
	userImage: string
}

const ProfileContext = createContext<ProfileContextProps | undefined>(undefined);

let updateUserFriends: () => void;

function ProfileProvider({ children }: ProfileProviderProps) {
    
    const [userFriends, setUserFriends] = useState<User[]>([])
    
    const tk = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];
    if (tk === undefined)
      return;
  
  updateUserFriends = () => {

    fetch(`http://localhost:3000/user/friends`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tk}`,
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
        const mappedFriends = data.map((friend: any) => ({
            id: friend.id,
            username: friend.login,
            userImage: friend.image,
        }));
        
        setUserFriends([...mappedFriends]);
    })
    .catch((error) => console.error("Fetch error:", error));

  }

  useEffect(() => {

    fetch(`http://localhost:3000/user/friends`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tk}`,
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
        const mappedFriends = data.map((friend: any) => ({
            id: friend.id,
            username: friend.login,
            userImage: friend.image,
        }));
        
        setUserFriends([...mappedFriends]);
    })
    .catch((error) => console.error("Fetch error:", error));

  }, []);

  // console.log("YOUR FRIENDS:", userFriends);

  const contextValue: ProfileContextProps = {
    userFriends: userFriends,
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}

export { ProfileContext, ProfileProvider, updateUserFriends };