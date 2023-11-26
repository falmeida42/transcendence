import Ball from "./Ball";
import Paddle from "./Paddle";

export default interface gameElements {
  paddleLeft: Paddle;
  paddleLeftScore: number;
  paddleRight: Paddle;
  paddleRightScore: number;
  ball: Ball;
  ballSide: string;
}
