import Ball from "./Ball";
import Paddle from "./Paddle";
import { Vec2 } from "./Vec2";

const gameFactory = (
  paddleLeftPos: Vec2,
  paddleRightPos: Vec2,
  ballPos: Vec2,
  againstAi: Boolean
) => {
  const paddleLeft = new Paddle(paddleLeftPos, { x: 5, y: 5 }, 20, 160, "left");
  const paddleRight = new Paddle(
    paddleRightPos,
    { x: 5, y: 5 },
    20,
    160,
    againstAi ? "ai" : "right"
  );
  const ball = new Ball(ballPos, 20, { x: 0, y: 0 });

  return { paddleLeft, paddleRight, ball };
};

export default gameFactory;
