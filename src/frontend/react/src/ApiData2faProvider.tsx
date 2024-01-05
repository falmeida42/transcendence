import React, { useEffect, ReactNode } from 'react';
import { useApi } from './apiStore';

interface ApiData2faProviderProps {
  children?: ReactNode;
}

const ApiData2faProvider: React.FC<ApiData2faProviderProps> = (props) => {
  const { setInfo } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token2fa');
      if (token != null) {
        console.log('token: ', token)
        const newUrl = window.location.href.split('?')[0]; // Remove query parameters
        window.history.replaceState({}, document.title, newUrl);
        document.cookie = `token2fa=${token}; expires=${new Date(Date.now() + 300000).toUTCString()}; path=/;`;
      }
      
      try {
        // const token = document.cookie
        // .split('; ')
        // .find((row) => row.startsWith('token='))
        // ?.split('=')[1];
        
        console.log('token: ', token, 'cookies: ', document.cookie);
        // console.log('token: ', token)
      

        const response = await fetch('http://localhost:3000/user/auth', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const data = await response.json();
        console.log(data);
        setInfo("", "", "", "", "", "", data);
        }
      catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [setInfo]);

  return <>{props.children}</>;
};

export default ApiData2faProvider;
