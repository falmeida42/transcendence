import { useEffect, useState } from 'react';
import { useApi } from './apiStore';
import { navigate } from 'wouter/use-location';

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
      
      const UpResponse = await fetch('http://localhost:3000/auth/2fa/authentication', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({code: newUserData}),
      })
      if (!UpResponse.ok){
        if (UpResponse.status === 401) {
          // Redirect to the login page
          window.location.href = 'http://localhost:3000/auth/login';
        }
        return;
      }
    } catch {
      navigate('/2fa');
      // console.error(error);
    }
    
    document.cookie = `'token2fa'=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    setauth(true);
    // navigate('/');
  };

  return (
    <div className='.this-input'>
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
      <div className='.this-button'>
      <button onClick={handleSendClick}>SEND</button>
      </div>
    </div>
  );
};

export default UseAuth;
