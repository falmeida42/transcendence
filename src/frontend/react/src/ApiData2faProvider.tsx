import React, { ReactNode, useEffect } from "react";
import { useApi } from "./apiStore";

interface ApiData2faProviderProps {
  children?: ReactNode;
}

const ApiData2faProvider: React.FC<ApiData2faProviderProps> = (props) => {
  const { setInfo } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const urlParams = new URLSearchParams(window.location.search);
        // const token = urlParams.get('token2fa');
        // if (token != null) {
        //   console.log('token: ', token)
        //   const newUrl = window.location.href.split('?')[0]; // Remove query parameters
        //   window.history.replaceState({}, document.title, newUrl);
        //   document.cookie = `token2fa=${token}; expires=${new Date(Date.now() + 300000).toUTCString()}; path=/;`;
        // }
        // else
        //   return;
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token2fa="))
          ?.split("=")[1];
        if (token === undefined) return;

        console.log("token: ", token, "cus: ", document.cookie);
        // console.log('token: ', token)

        const UpResponse = await fetch("http://localhost:3000/user/auth", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!UpResponse.ok) {
          if (UpResponse.status === 401) {
            // Redirect to the login page
            window.location.href = "http://localhost:3000/auth/login";
          }
          return;
        }

        const data = await UpResponse.json();
        console.log(data);
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
