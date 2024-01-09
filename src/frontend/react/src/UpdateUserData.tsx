import React, { useEffect } from 'react';

interface UseUpdateUserDataProps {
  updateFunction: () => { username?: string; image?: any };
}

const useUpdateUserData = ({ updateFunction }: UseUpdateUserDataProps) => {
  useEffect(() => {
    const updateUserData = async () => {
      try {
        const newUserData = updateFunction();
        const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];
        if (token === undefined){
          return;
        }

        await fetch('http://localhost:3000/user/me', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUserData),
        });

      } catch {
        console.error('error');
      }
    };

    updateUserData();
  }, [updateFunction]);

  return {updateFunction};
};

export default useUpdateUserData;