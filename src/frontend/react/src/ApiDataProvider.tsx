import React, { ReactNode, useEffect } from "react";
import { useApi } from "./apiStore";

interface ApiDataProviderProps {
  children?: ReactNode;
}

const ApiDataProvider: React.FC<ApiDataProviderProps> = (props) => {
  const { auth, setInfo} = useApi();
  
  useEffect(() => {
    const fetchData = async () => {
      // const urlParams = new URLSearchParams(window.location.search);
      // const token = urlParams.get('token');
      // if (token != null) {
      //   console.log('token: ', token)
      //   const newUrl = window.location.href.split('?')[0]; // Remove query parameters
      //   window.history.replaceState({}, document.title, newUrl);
      //   document.cookie = `token=${token}; expires=${new Date(Date.now() + 300000).toUTCString()}; path=/;`;
      // }

      try {
        // console.log(document.cookie, '123');
        const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];
        if (token === undefined)
          return;

        // if (token === undefined){
        //   setInfo("", "", "", "", "", "", true);
        //   return;
        // }
        const response = await fetch('http://localhost:3000/user/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok){
          if (response.status === 401) {
            // Redirect to the login page
            window.location.href = 'http://localhost:3000/auth/login';
          }
          return;
        }

        const data = await response.json();
        // console.log(data);
        setInfo(data.id, data.user, data.first_name, data.last_name, data.login, data.email, data.image, data.twoFactorAuthEnabled);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [setInfo]);

  return <>{props.children}</>;
};

export default ApiDataProvider;
