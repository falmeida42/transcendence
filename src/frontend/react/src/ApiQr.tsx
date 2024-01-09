import React, { ReactNode, useEffect } from "react";
import { useApi } from "./apiStore";

interface ApiQrProps {
  children?: ReactNode;
}

const ApiQr: React.FC<ApiQrProps> = (props) => {
  const { setqrcode } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      if (token === undefined) return;

      // console.log(token, 'QR');

      try {
        const response = await fetch(
          "http://localhost:3000/auth/2fa/generate",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          if (response.status === 401) {
            // Redirect to the login page
            window.location.href = "http://localhost:3000/auth/login";
          }
          return;
        }

        const data = await response.json();
        // console.log(JSON.stringify(data));
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
