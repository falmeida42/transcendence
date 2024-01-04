import React, { useEffect, ReactNode } from 'react';
import { useApi } from './apiStore';

interface ApiQrProps {
  children?: ReactNode;
}

const ApiQr: React.FC<ApiQrProps> = (props) => {
  const { setqrcode } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      try {
        const response = await fetch('http://localhost:3000/auth/2fa/generate', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to get QRCODE.');
        }

        const data = await response.json();
        console.log(JSON.stringify(data));
        setqrcode(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return <>{props.children}</>;
};

export default ApiQr;