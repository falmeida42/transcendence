import Ball from "./Ball";
import Paddle from "./Paddle";
import { Vec2 } from "./Vec2";
import gameElements from "./gameElements";

const gameFactory = (
  paddleLeftPos: Vec2,
  paddleRightPos: Vec2,
  ballPos: Vec2,
  againstAi: boolean,
  leftScore: number,
  rightScore: number
): gameElements => {
  const paddleLeft = new Paddle(paddleLeftPos, { x: 5, y: 5 }, 15, 100, "left");
  const paddleRight = new Paddle(
    paddleRightPos,
    { x: 5, y: 5 },
    15,
    100,
    againstAi ? "ai" : "right"
  );
  const ball = new Ball(ballPos, 12, { x: 0, y: 0 });

  return {
    paddleLeft,
    paddleLeftScore: leftScore,
    paddleRight,
    paddleRightScore: rightScore,
    ball,
    ballSide: "left",
  };
};

export default gameFactory;
