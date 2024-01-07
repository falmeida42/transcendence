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

        const updateResponse = await fetch('http://localhost:3000/user/me', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUserData),
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to fetch user data');
        }

        const updatedData = await updateResponse.json();
        console.log(updatedData);
      } catch (error) {
        // console.error(error);
      }
    };

    // Call updateUserData when the component mounts
    // updateUserData();
  }, [updateFunction]);

  return {updateFunction};
};

export default useUpdateUserData;