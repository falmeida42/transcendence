import { useEffect } from "react";
import { navigate } from "wouter/use-location";
import { useApi } from "./apiStore";

interface UseUpdateUserDataProps {
  username?: string;
  image?: string;
}

const useUpdateUserData = (props: UseUpdateUserDataProps) => {
  const { setfailToUpdate, setImage, setUsername } = useApi();
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  if (token === undefined) {
    return;
  }

  useEffect(() => {
    const updateData = async () => {
      try {
        const response = await fetch("http://10.12.8.6:3000/user/me", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: props.username,
            image: props.image,
          }),
        });
        if (!response.ok) {
          if (response.status === 401) {
            navigate("/login");
            return;
          }
          setfailToUpdate(true);
        } else {
          setfailToUpdate(false);
          if (props.image !== undefined) {
            setImage(props.image);
          }
          if (props.username !== undefined) {
            setUsername(props.username);
          }
        }
      } catch {
        // console.error(error);
      }
    };
    updateData();
  }, [props.username, props.image]);
};

export default useUpdateUserData;
