import React, { ReactNode, useEffect } from "react";
import { useApi } from "./apiStore";
import { navigate } from "wouter/use-location";

interface ApiDataProviderProps {
  children?: ReactNode;
}

const ApiDataProvider: React.FC<ApiDataProviderProps> = (props) => {
  const { auth, setInfo, twofa, user, login, image, qrcode, email, first_name, last_name, id} = useApi();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];
        if (token === undefined) return;

        const response = await fetch('http://localhost:3000/user/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login');
          }
          return;
        }

        const data = await response.json();
        setInfo(
          data.id,
          data.username,
          data.first_name,
          data.last_name,
          data.login,
          data.email,
          data.image,
          data.twoFactorAuthEnabled
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [auth, setInfo, twofa, user, login, image, qrcode, email, first_name, last_name, id]);

  return <>{props.children}</>;
};

export default ApiDataProvider;
