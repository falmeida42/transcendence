import { navigate } from "wouter/use-location";
import { useApi } from "./apiStore";

interface UsetwofaProps {
  handleClose: () => void;
}

const Usetwofa = ({ handleClose }: UsetwofaProps) => {
  const {twofa} = useApi();

  const { settwofa } = useApi();

  const handleSendClick = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      if (token === undefined) return;


      const response = await fetch('http://localhost:3000/auth/2fa/turn-off', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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
