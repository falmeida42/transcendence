import React, { useEffect, useRef } from "react";
import Ball from "./Ball";
import "./Game.css";
import Paddle from "./Paddle";
import { draw_field } from "./draw";

type CanvasProps = React.DetailedHTMLProps<
  React.CanvasHTMLAttributes<HTMLCanvasElement>,
  HTMLCanvasElement
>;

const ballPaddleCollision = (ball: Ball, paddle: Paddle) => {
  let dx = Math.abs(ball.pos.x - paddle.getCenter().x);
  let dy = Math.abs(ball.pos.y - paddle.getCenter().y);

  if (
    dx <= ball.radius + paddle.getHalfWidth() &&
    dy <= ball.radius + paddle.getHalfHeight()
  )
    ball.velocity.x *= -1;
};

const player2Ai = (ball: Ball, paddle: Paddle) => {
  if (ball.velocity.x > 0) {
    if (ball.pos.y > paddle.pos.y) {
      paddle.pos.y += paddle.velocity.y;
    }

    if (ball.pos.y < paddle.pos.y) {
      paddle.pos.y -= paddle.velocity.y;
    }
  }
};

const gameUpdate = (
  ball: Ball,
  paddleLeft: Paddle,
  paddleRight: Paddle,
  canvasWidth: number,
  canvasHeight: number,
  keysPressed
) => {
  ball.update();
  paddleLeft.update(keysPressed);
  paddleLeft.colisionWithWalls(canvasHeight);
  ball.colisionWithWalls(canvasWidth, canvasHeight);
  player2Ai(ball, paddleRight);
  paddleRight.colisionWithWalls(canvasHeight);
  ballPaddleCollision(ball, paddleLeft);
  ballPaddleCollision(ball, paddleRight);
};

const draw = (
  ctx: CanvasRenderingContext2D,
  ball: Ball,
  paddleLeft: Paddle,
  paddleRight: Paddle
) => {
  ball.draw(ctx);
  paddleLeft.draw(ctx);
  paddleRight.draw(ctx);
};

const Game: React.FC<CanvasProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const width = Number(props.width);
  const height = Number(props.height);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.height = height;
    canvas.width = width;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationId: number;

    const ball = new Ball({ x: 200, y: 200 }, 20, { x: 10, y: 10 });
    const paddleLeft = new Paddle({ x: 0, y: 50 }, { x: 5, y: 5 }, 20, 160);
    const paddlRight = new Paddle(
      { x: width - 20, y: 30 },
      { x: 5, y: 5 },
      20,
      160
    );

    const keysPressed = {
      ArrowUp: false,
      ArrowDown: false,
      w: false,
      s: false,
    };

    window.addEventListener("keydown", (e) => {
      keysPressed[e.key] = true;
    });

    window.addEventListener("keyup", (e) => {
      keysPressed[e.key] = false;
    });

    const gameLoop = () => {
      // ctx.clearRect(0, 0, canvas.width, canvas.height);
      draw_field(ctx, width, height);
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, width, height);
      draw(ctx, ball, paddleLeft, paddlRight);
      gameUpdate(ball, paddleLeft, paddlRight, width, height, keysPressed);
      animationId = window.requestAnimationFrame(gameLoop);
    };
    gameLoop();

    return () => window.cancelAnimationFrame(animationId);
  }, [draw]);

  return <canvas ref={canvasRef} />;
};

export default Game;
