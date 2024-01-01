import React, { ReactNode, useEffect } from "react";
import { useApi } from "./apiStore";

interface ApiDataProviderProps {
  children?: ReactNode;
}

const ApiDataProvider: React.FC<ApiDataProviderProps> = (props) => {
  const { setInfo } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      try {
        const response = await fetch(`http://localhost:3000/user/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        console.log(data);
        setInfo(
          data.user,
          data.first_name,
          data.last_name,
          data.login,
          data.email,
          data.image
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [setInfo]);

  return <>{props.children}</>;
};

export default ApiDataProvider;
