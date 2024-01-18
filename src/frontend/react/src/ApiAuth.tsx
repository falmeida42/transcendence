import { useState } from "react";
import { navigate } from "wouter/use-location";
import { useApi } from "./apiStore";

interface UseAuthProps {
  code: string;
}

const UseAuth = ({ code }: UseAuthProps) => {
  const [name, setName] = useState(code);
  const [status, setStatus] = useState("SEND");
  const { setauth, auth } = useApi();

  const handleSendClick = async () => {
    try {
      const newUserData = name;
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token2fa="))
        ?.split("=")[1];

      if (token === undefined) return;

      const UpResponse = await fetch(
        "http://localhost:3000/auth/2fa/authentication",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ code: newUserData }),
        }
      );
      if (!UpResponse.ok) {
        if (UpResponse.status === 401) {
          navigate("/login");
        }
        setStatus("WRONG");
        navigate("/2fa");
        return;
      }
      document.cookie = `${"token2fa"}'=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      setauth(true);
      navigate("/");
    } catch (error) {}
  };

  // useEffect(() => {},[auth]);

  return (
    <div className="centered2-container">
      {" "}
      <h2 style={{ paddingBottom: `45px`, color: "#FFF" }}>
        Please insert your 2FA code.
      </h2>
      <div className=".small-input.container">
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
      </div>
      <div className="special-button" onClick={handleSendClick}>
        {status}
      </div>
    </div>
  );
};

export default UseAuth;
