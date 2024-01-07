import React, { useEffect, ReactNode } from 'react';
import { useApi } from './apiStore';

interface ApiDataProviderProps {
  children?: ReactNode;
}

const ApiDataProvider: React.FC<ApiDataProviderProps> = (props) => {
  const { auth, setInfo} = useApi();
  
  useEffect(() => {
    const fetchData = async () => {

      try {
        const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];
        if (token === undefined)
          return;

        const response = await fetch('http://localhost:3000/user/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        // console.log(data);
        setInfo(data.user, data.first_name, data.last_name, data.login, data.email, data.image, data.twoFactorAuthEnabled);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [setInfo]);

  return <>{props.children}</>;
};

export default ApiDataProvider;
