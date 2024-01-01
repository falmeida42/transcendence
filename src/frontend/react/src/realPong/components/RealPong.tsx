import { useContext, useEffect } from "react";
import SVG, { Circle, Line, Rect } from "react-svg-draw";
import { SocketContext, gameLoaded, sendKey } from "../context/SocketContext";

const RealPong = () => {
  const { match, winner } = useContext(SocketContext);
  const { gameConfig, ball, player1, player2 } = match!;

  useEffect(() => {
    console.log("RealPong.tsx: useEffect");
    gameLoaded();

    const sendKeyEvent = (e: KeyboardEvent) => {
      const { key, type } = e;

      if (key === "ArrowUp" || key === "ArrowDown") {
        sendKey(key, type);
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", sendKeyEvent);
    document.addEventListener("keyup", sendKeyEvent);

    return () => {
      document.removeEventListener("keydown", sendKeyEvent);
      document.removeEventListener("keyup", sendKeyEvent);
    };
  }, []);

  return (
    <div>
      <SVG
        width={gameConfig.width.toString()}
        height={gameConfig.height.toString()}
      >
        <defs>
          <pattern
            id="image"
            x="0%"
            y="0%"
            height="100%"
            width="100%"
            viewBox={
              "0 0 " +
              gameConfig.width.toString() +
              " " +
              gameConfig.height.toString()
            }
          >
            <image
              x="0"
              y="0"
              width={gameConfig.width.toString()}
              height={gameConfig.height.toString()}
              xlinkHref="https://cdn.intra.42.fr/users/baf96bbadcaa62e4d9c24524ad0738e9/lucas-ma.JPG"
            ></image>
          </pattern>
        </defs>
        <Rect
          x={"0"}
          y={"0"}
          width={gameConfig.width.toString()}
          height={gameConfig.height.toString()}
          style={{ fill: "#000" }}
        />
        <Rect
          x={"0"}
          y={"0"}
          width={gameConfig.width.toString()}
          height={gameConfig.height.toString()}
          style={{ fill: "url(#image)" }}
        />

        <Line
          x1={(gameConfig.width / 2).toString()}
          y1={"0"}
          x2={(gameConfig.width / 2).toString()}
          y2={gameConfig.height.toString()}
          // strokeDasharray="5,5"
          strokeWidth="5"
          style={{ stroke: "rgb(255, 255, 255)" }}
        />
        <Circle
          cx={(gameConfig.width / 2).toString()}
          cy={(gameConfig.height / 2).toString()}
          r={(gameConfig.height / 4).toString()}
          style={{ fill: "none", stroke: "#FFF", strokeWidth: "2" }}
        />
        <Circle
          cx={(gameConfig.width / 2).toString()}
          cy={(gameConfig.height / 2).toString()}
          r={(gameConfig.height / 40).toString()}
          style={{ fill: "#fff" }}
        />
        <text
          x={(gameConfig.width / 2 - 20).toString()}
          y="45"
          style={{
            direction: "rtl",
            fill: "rgba(255, 255, 255, 0.7)",
            fontSize: "50px",
          }}
        >
          {match?.score1}
        </text>

        <text
          x={(gameConfig.width / 2 + 20).toString()}
          y="45"
          style={{
            fill: "rgba(255, 255, 255, 0.7)",
            fontSize: "50px",
          }}
        >
          {match?.score2}
        </text>

        <text>{`${winner} ganhou o jogo!`}</text>

        {ball && (
          <Circle
            cx={ball.x.toString()}
            cy={ball.y.toString()}
            r={ball.radius.toString()}
            style={{ fill: "#61ff22" }}
          />
        )}

        {player1 && (
          <Rect
            x={player1.x.toString()}
            y={player1.y.toString()}
            width={player1.width.toString()}
            height={player1.height.toString()}
            style={{ fill: "#fff" }}
          />
        )}

        {player2 && (
          <Rect
            x={player2.x.toString()}
            y={player2.y.toString()}
            width={player2.width.toString()}
            height={player2.height.toString()}
            style={{ fill: "#fff" }}
          />
        )}
      </SVG>
    </div>
  );
};

export default RealPong;
