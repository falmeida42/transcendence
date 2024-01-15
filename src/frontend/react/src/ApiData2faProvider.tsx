import React, { useEffect, ReactNode } from 'react';
import { useApi } from './apiStore';
import { navigate } from 'wouter/use-location';

interface ApiData2faProviderProps {
  children?: ReactNode;
}

const ApiData2faProvider: React.FC<ApiData2faProviderProps> = (props) => {
  const { setInfo } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token2fa="))
          ?.split("=")[1];
        if (token === undefined) return;

        // console.log('token: ', token, 'cus: ', document.cookie);
      

        const UpResponse = await fetch("http://localhost:3000/user/auth", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!UpResponse.ok) {
          if (UpResponse.status === 401) {
            navigate('/login');
          }
          return;
        }

        const data = await UpResponse.json();
        // console.log(data);
        setInfo("", "", "", "", "", "", "", data, "");
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [setInfo]);

  return <>{props.children}</>;
};

export default ApiData2faProvider;
