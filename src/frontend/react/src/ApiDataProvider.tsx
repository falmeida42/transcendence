import React, { ReactNode, useEffect } from "react";
import { useParams } from "wouter";
import { navigate } from "wouter/use-location";
import { useApi } from "./apiStore";

interface ApiDataProviderProps {
  children?: ReactNode;
}

const ApiDataProvider: React.FC<ApiDataProviderProps> = (props) => {
  const { auth, setInfo } = useApi();
  const {} = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];
        if (token === undefined || auth === false) return;

        const response = await fetch("http://10.12.8.6:3000/user/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          if (response.status === 401) {
            navigate("/login");
          }
          return;
        }
        const friends = await fetch("http://10.12.8.6:3000/user/friends", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!friends.ok) {
          if (friends.status === 401) {
            navigate("/login");
          }
        }

        const data = await response.json();
        const dataFriends = await friends.json();
        setInfo(
          data.id,
          data.username,
          data.first_name,
          data.last_name,
          data.login,
          data.email,
          data.image,
          data.twoFactorAuthEnabled,
          dataFriends
        );
      } catch (error) {
        // console.error(error);
      }
    };

    fetchData();
  }, [auth, setInfo]);

  return <>{props.children}</>;
};

export default ApiDataProvider;
