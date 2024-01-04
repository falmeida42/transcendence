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
      if (token) {
        const newUrl = window.location.href.split('?')[0]; // Remove query parameters
        window.history.replaceState({}, document.title, newUrl);
      }

      try {
        const authToken = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
        console.log(authToken);
        const response = await fetch('http://localhost:3000/user/auth', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        console.log(data);
        setInfo("", "", "", "", "", "", data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [setInfo]);

  return <>{props.children}</>;
};

export default ApiData2faProvider;
