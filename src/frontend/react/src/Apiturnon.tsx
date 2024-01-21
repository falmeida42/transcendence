import { useState } from "react";
import { navigate } from "wouter/use-location";
import "./Profile.css";
import { useApi } from "./apiStore";

interface UseturnoffProps {
  code: string;
  handleClose: () => void;
}

const Useturnoff = ({ code, handleClose }: UseturnoffProps) => {
  const [name, setName] = useState(code);
  const [err, setErr] = useState("SEND");
  const { setauth, settwofa } = useApi();

  const handleSendClick = async () => {
    try {
      const newUserData = name;
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      if (token === undefined) return;

      const res = await fetch("http://10.12.8.6:3000/auth/2fa/turn-on", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: newUserData }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          // console.log('401');
          setErr("WRONG!");
          // const data = await res.json();
          // console.log('401', JSON.stringify(data));
          return;
        }
      }
      setauth(true);
      settwofa(true);
      // navigate('/Profile');
      handleClose();
      setErr("DONE!");
    } catch {
      navigate("/Profile");
      return;
    }
  };

  return (
    <div>
      <input
        type="string"
        name="name"
        className="password-input popup-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendClick();
          }
        }}
      />
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={handleSendClick}>
          {err}
        </button>
      </div>
    </div>
  );
};

export default Useturnoff;
