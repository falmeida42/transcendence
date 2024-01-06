import { useState } from 'react';
import { useApi } from './apiStore';

interface UseAuthProps {
  code: string;
}

const UseAuth = ({ code }: UseAuthProps) => {
  const [name, setName] = useState(code);
  const {setauth} = useApi();

  const handleSendClick = async () => {
    // Move the logic from UseAuth to handleSendClick
    // Make sure not to call hooks here
    try {
      const newUserData = name;
      const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token2fa='))
      ?.split('=')[1];
      console.log(token, '@');
      if (token === undefined)
        return;

      await fetch('http://localhost:3000/auth/2fa/authentication', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({code: newUserData}),
      })
        setauth(true);
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

export default UseAuth;
