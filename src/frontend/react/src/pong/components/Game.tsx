import { useContext, useEffect } from "react";
import SVG, { Circle, Line, Rect } from "react-svg-draw";
import { GameContext, gameLoaded, leaveRoom } from "./contexts/gameContext";

// interface GameProps {
//   // Add any props you need for the Game component
// }

const Game = () => {
  const { match } = useContext(GameContext);
  const { gameConfig, ball, message } = match;

  useEffect(() => {
    gameLoaded();
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <SVG width={gameConfig.width} height={gameConfig.height}>
        <Rect
          x={0}
          y={0}
          width={gameConfig.width}
          height={gameConfig.height}
          style={{ fill: "#000" }}
        />
        <Line
          x1={gameConfig.width / 2}
          y1={0}
          x2={gameConfig.width / 2}
          y2={gameConfig.height}
          strokeDasharray="5, 5"
          stroke-width="5"
          style={{ stroke: "rgba(255, 255, 255, 0.5)" }}
        />
        <text
          x={gameConfig.width / 2 - 20}
          y="45"
          style={{
            direction: "rtl",
            fill: "rgba(255, 255, 255, 0.7)",
            fontSize: "50px",
          }}
        >
          {match.score1}
        </text>
        <text
          x={gameConfig.width / 2 + 20}
          y="45"
          style={{
            fill: "rgba(255, 255, 255, 0.7)",
            fontSize: "50px",
          }}
        >
          {match.score2}
        </text>
        {ball && (
          <Circle
            cx={ball.x}
            cy={ball.y}
            r={ball.width}
            style={{ fill: "#fff" }}
          />
        )}
      </SVG>

      {message && (
        <div className="game-message">
          <h4>{message}</h4>
          <button onClick={leaveRoom}>Voltar</button>
        </div>
      )}
    </div>
  );
};

export default Game;
