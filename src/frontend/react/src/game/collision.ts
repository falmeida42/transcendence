import Ball from "./Ball";
import Paddle from "./Paddle";

export const ballPaddleCollision = (ball: Ball, paddle: Paddle) => {
  const dx = Math.abs(ball.pos.x - paddle.getCenter().x);
  const dy = Math.abs(ball.pos.y - paddle.getCenter().y);

  if (
    dx < ball.radius + paddle.getHalfWidth() &&
    dy < ball.radius + paddle.getHalfHeight()
  ) {
    if (ball.velocity.x < 0) ball.velocity.x = ball.velocity.x * -1 + 1;
    else ball.velocity.x = ball.velocity.x * -1 - 1;
  }
};
