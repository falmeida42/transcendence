import { navigate } from 'wouter/use-location';
import { useApi } from './apiStore';

interface UsetwofaProps {
  handleClose: () => void;
}

const Usetwofa = ({ handleClose }: UsetwofaProps) => {
  const {twofa} = useApi();

  const { settwofa } = useApi();

  const handleSendClick = async () => {
    // Move the logic from Usetwofa to handleSendClick
    // Make sure not to call hooks here
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];
      if (token === undefined)
        return;

      // console.log(token, 'turn on');

      await fetch('http://localhost:3000/auth/2fa/turn-off', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.error(error);
    }
    // setauth(true);
    settwofa(false);
    //navigate('/Profile');
    handleClose();
  };

  return (
    <div>
      <p>Disable two-factor authentication.</p>      
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={handleSendClick}>Disable 2FA</button>
      </div>
    </div>
  );
};

export default Usetwofa;
