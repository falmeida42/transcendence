import React, { useEffect, useRef } from "react";
import "./Game.css";
import Player from "./Player";
import { draw } from "./draw";

type CanvasProps = React.DetailedHTMLProps<
  React.CanvasHTMLAttributes<HTMLCanvasElement>,
  HTMLCanvasElement
>;

const Game: React.FC<CanvasProps> = ({ ...props }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = Number(props.width);
    const height = Number(props.height);

    let player1 = new Player(5, height / 2 - 150 / 2);
    let player2 = new Player(width - 20 - 5, height / 2 - 150 / 2);
    draw(ctx, width, height, player1, player2);
  }, [draw]);

  return (
    <canvas
      width={Number(props.width)}
      height={Number(props.height)}
      ref={canvasRef}
    />
  );
};

export default Game;
