import { useEffect, useRef, useState } from "react";
import Ball from "./Ball";
import "./Game.css";
import { ballPaddleCollision } from "./collision";
import { draw, draw_field } from "./draw";
import gameElements from "./gameElements";
import gameFactory from "./gameFactory";

const resetGame = (
  gameElements: gameElements,
  canvasWidth: number,
  canvasHeight: number
) => {
  gameElements.paddleLeft.pos.x = 5;
  gameElements.paddleLeft.pos.y = canvasHeight / 2;
  gameElements.paddleRight.pos.x = canvasWidth - 25;
  gameElements.paddleRight.pos.y = canvasHeight / 2;
  gameElements.ball.pos.x = canvasWidth / 2;
  gameElements.ball.pos.y = canvasHeight / 2;
  gameElements.ball.velocity.x = 0;
  gameElements.ball.velocity.y = 0;
};

const launchBall = (ball: Ball, ballSide: string) => {
  let choice = Math.round(Math.random());
  ball.velocity.y = choice === 0 ? 5 : -5;
  ball.velocity.x = ballSide === "right" ? 5 : -5;
};

const score = (
  whoScored: string,
  gameElements: gameElements,
  setScoreLeft: React.Dispatch<React.SetStateAction<number>>,
  setScoreRight: React.Dispatch<React.SetStateAction<number>>,
  canvasWidth: number,
  canvasHeight: number
) => {
  if (whoScored === "right") {
    gameElements.paddleRightScore += 1;
    setScoreRight(gameElements.paddleRightScore);
    gameElements.ballSide = "left";
    resetGame(gameElements, canvasWidth, canvasHeight);
  } else {
    gameElements.paddleLeftScore += 1;
    setScoreLeft(gameElements.paddleLeftScore);
    gameElements.ballSide = "right";
    resetGame(gameElements, canvasWidth, canvasHeight);
  }
};

const gameUpdate = (
  gameElements: gameElements,
  canvasWidth: number,
  canvasHeight: number,
  keysPressed: any,
  setScoreLeft: React.Dispatch<React.SetStateAction<number>>,
  setScoreRight: React.Dispatch<React.SetStateAction<number>>
) => {
  if (keysPressed[" "] && gameElements.ball.velocity.x === 0)
    launchBall(gameElements.ball, gameElements.ballSide);

  gameElements.ball.update();
  gameElements.paddleLeft.update(keysPressed, gameElements.ball);
  gameElements.paddleLeft.colisionWithWalls(canvasHeight);
  gameElements.ball.colisionWithWalls(canvasHeight);

  if (gameElements.ball.pos.x < 0) {
    score(
      "right",
      gameElements,
      setScoreLeft,
      setScoreRight,
      canvasWidth,
      canvasHeight
    );
  } else if (gameElements.ball.pos.x > canvasWidth) {
    score(
      "left",
      gameElements,
      setScoreLeft,
      setScoreRight,
      canvasWidth,
      canvasHeight
    );
  }

  gameElements.paddleRight.update(keysPressed, gameElements.ball);
  gameElements.paddleRight.colisionWithWalls(canvasHeight);
  ballPaddleCollision(gameElements.ball, gameElements.paddleLeft);
  ballPaddleCollision(gameElements.ball, gameElements.paddleRight);
};

const Game: any = (props: any) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const width = Number(props.width);
  const height = Number(props.height);
  let [scoreLeft, setScoreLeft] = useState(0);
  let [scoreRight, setScoreRight] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.height = height;
    canvas.width = width;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationId: number;

    const gameElements: gameElements = gameFactory(
      { x: 5, y: height / 2 },
      { x: width - 25, y: height / 2 },
      { x: width / 2, y: height / 2 },
      props.againstAi
    );

    const keysPressed: any = {
      ArrowUp: false,
      ArrowDown: false,
      w: false,
      s: false,
      " ": false,
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
      draw(ctx, gameElements);
      gameUpdate(
        gameElements,
        width,
        height,
        keysPressed,
        setScoreLeft,
        setScoreRight
      );
      animationId = window.requestAnimationFrame(gameLoop);
    };
    gameLoop();

    return () => window.cancelAnimationFrame(animationId);
  }, [draw]);

  return (
    <div>
      <canvas ref={canvasRef} />
      <h1 id="scoreLeft">{scoreLeft}</h1>
      <h1 id="scoreRight">{scoreRight}</h1>
    </div>
  );
};

export default Game;
