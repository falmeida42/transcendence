import Ball from "./Ball";
import Paddle from "./Paddle";

export default interface gameElements {
  paddleLeft: Paddle;
  paddleRight: Paddle;
  ball: Ball;
}
