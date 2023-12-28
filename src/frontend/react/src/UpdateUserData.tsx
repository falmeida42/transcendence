import React, { useEffect } from 'react';

interface UseUpdateUserDataProps {
  updateFunction: () => { username?: string; image?: any };
//   newData: { username?: string; image?: string };
}

const useUpdateUserData = ({ updateFunction }: UseUpdateUserDataProps) => {
  useEffect(() => {
    const updateUserData = async () => {
      try {
        const newUserData = updateFunction();
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        const updateResponse = await fetch('http://localhost:3000/user/me', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUserData),
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to update user data');
        }

        const updatedData = await updateResponse.json();
        console.log(updatedData);
      } catch (error) {
        console.error(error);
      }
    };

    // Call updateUserData when the component mounts
    updateUserData();
  }, [updateFunction]);

  return {updateFunction};
};

export default useUpdateUserData;
