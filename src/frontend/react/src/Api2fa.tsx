import { useState } from 'react';
import { useApi } from './apiStore';

interface UsetwofaProps {
  code: string;
}

const Usetwofa = ({ code }: UsetwofaProps) => {
  const [name, setName] = useState(code);
  const {setauth} = useApi();

  const handleSendClick = () => {
    // Move the logic from Usetwofa to handleSendClick
    // Make sure not to call hooks here
    try {
      const newUserData = name;
      const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];
      if (token === undefined)
        return;

      // console.log(token, 'turn on');

      fetch('http://localhost:3000/auth/2fa/turn-on', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({code: newUserData}),
      })
        .then((updateResponse) => {
          if (!updateResponse.ok) {
            console.log(updateResponse);
            console.log(newUserData);
            throw new Error('Failed to turn-on 2FA.');
          }
          setauth(true);
          console.log(JSON.stringify(updateResponse.json))
          return updateResponse.json();
        })
        .then((updatedData) => {
          console.log(updatedData);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        type="string"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSendClick();
          }
        }}
      />
      <button onClick={handleSendClick}>SEND</button>
    </div>
  );
};

export default Usetwofa;
