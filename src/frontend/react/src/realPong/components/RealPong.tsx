import { useContext, useEffect } from "react";
import SVG, { Circle, Line, Rect } from "react-svg-draw";
import {
  SocketContext,
  gameLoaded,
  pauseGame,
  sendKey,
} from "../context/SocketContext";

interface props {
  setPage: (value: React.SetStateAction<number>) => void;
}

const RealPong = (props: props) => {
  const { match } = useContext(SocketContext);
  const { gameConfig, ball, player1, player2, status, message } = match!;
  // const [page, setPage] = useState(0);

  useEffect(() => {
    const sendKeyEvent = (e: KeyboardEvent) => {
      const { key, type } = e;
      if (e.repeat) return;
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
  }, [status]);

  return (
    <div className="gamePage">
      {status === "START" && (
        <button className="pauseButton" onClick={() => gameLoaded()}>
          Ready
        </button>
      )}
      {status === "PLAY" && (
        <button className="pauseButton" onClick={() => pauseGame()}>
          Pause
        </button>
      )}
      {status === "PAUSE" && (
        <button className="pauseButton" onClick={() => gameLoaded()}>
          Resume
        </button>
      )}
      {status === "END" && (
        <button
          className="pauseButton"
          onClick={() => {
            props.setPage(3);
          }}
        >
          Leave
        </button>
      )}
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
              xlinkHref="https://cdn.intra.42.fr/users/6e834c7689fb6ec761861181e5fc177c/maxthecorgi.png"
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
          STOP
          width={gameConfig.width.toString()}
          height={gameConfig.height.toString()}
          style={{ fill: "url(#image)" }}
        />
        <Line
          x1={(gameConfig.width / 2).toString()}
          y1={"0"}
          x2={(gameConfig.width / 2).toString()}
          y2={gameConfig.height.toString()}
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
          y="55"
          style={{
            direction: "rtl",
            fill: "rgba(255, 255, 255, 0.7)",
            fontSize: "30px",
          }}
        >
          {match?.score1 + " " + match?.player1.name}
        </text>
        <text
          x={(gameConfig.width / 2 + 20).toString()}
          y="55"
          style={{
            fill: "rgba(255, 255, 255, 0.7)",
            fontSize: "30px",
          }}
        >
          {match?.score2 + " " + match?.player2.name}
        </text>
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
        user,
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
      {message && (
        <h1
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            color: "#FFF",
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          {message}
        </h1>
      )}
    </div>
  );
};

export default RealPong;
