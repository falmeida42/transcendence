import React, { useEffect, ReactNode } from 'react';
import { useApi } from './apiStore';

interface ApiQrProps {
  children?: ReactNode;
}

const ApiQr: React.FC<ApiQrProps> = (props) => {
  const { setQrcode } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      try {
        const response = await fetch('http://localhost:3000/2fa/generate', {
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
        console.log(data);
        setQrcode(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [setQrcode]);

  return <>{props.children}</>;
};

export default ApiQr;
