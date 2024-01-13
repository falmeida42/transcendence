import React, { ReactNode, useEffect } from 'react';

interface UseUpdateUserDataProps {
  username: string | undefined;
  image: string | undefined;
}

const useUpdateUserData = (props: UseUpdateUserDataProps) => {
  const token = document.cookie
  .split('; ')
  .find((row) => row.startsWith('token='))
  ?.split('=')[1];
  if (token === undefined){
    return;
  }

  useEffect(() => {
    const updateData = async () => {
      try {
        await fetch('http://localhost:3000/user/me', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: props.username,
            image: props.image,
          }),
        });
        
      } catch (error) {
        console.error(error);
      }
    };
    updateData();
}, [props.username, props.image]);
};

export default useUpdateUserData;