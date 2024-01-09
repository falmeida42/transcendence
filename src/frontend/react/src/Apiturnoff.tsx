import { navigate } from 'wouter/use-location';
import { useApi } from './apiStore';

const Usetwofa = () => {

  const { settwofa } = useApi();

  const handleSendClick = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];
      if (token === undefined)
        return;


      const response = await fetch('http://localhost:3000/auth/2fa/turn-off', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok){
        if (response.status === 401) {
          navigate('/login');
        }
        return;
      }
    } catch (error) {
      console.error(error);
    }
    settwofa(false);
  };

  return (
    <label className="lock-checkbox">
      <input id="lock" type="checkbox" />
      <span
        className={`lock-icon`}
        onClick={handleSendClick}
      >
        2FA
        <svg viewBox="0 0 24 24">
          <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H8.9V6z"></path>
        </svg>
      </span>
    </label>
  );
};

export default Usetwofa;
