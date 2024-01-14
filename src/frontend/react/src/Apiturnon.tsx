import { useState } from "react";
import { navigate } from "wouter/use-location";
import { useApi } from "./apiStore";

interface UseturnoffProps {
  code: string;
}

const Useturnoff = ({ code }: UseturnoffProps) => {
  const [name, setName] = useState(code);
  const [err, setErr] = useState("SEND");
  const { setauth, settwofa } = useApi();

  const handleSendClick = async () => {
    // Move the logic from Useturnoff to handleSendClick
    // Make sure not to call hooks here
    try {
      const newUserData = name;
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      if (token === undefined) return;

      // console.log(token, 'turn on');

      const res = await fetch("http://localhost:3000/auth/2fa/turn-on", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: newUserData }),
      });
      // console.log(res.status);
      if (!res.ok) {
        if (res.status === 401) {
          console.log("401");
          // navigate('/Profile');
          setErr("WRONG!");
          const data = await res.json();
          console.log("401", JSON.stringify(data));
          return;
        }
      }
      setauth(true);
      settwofa(true);
      navigate("/");
      setErr("DONE!");
    } catch {
      // console.log('catch', JSON.stringify(error));
      navigate("/Profile");
      return;
    }

    // return;
  };

  return (
    <div>
      <input
        type="string"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendClick();
          }
        }}
      />
      <button onClick={handleSendClick}>{err}</button>
    </div>
  );
};

export default Useturnoff;
