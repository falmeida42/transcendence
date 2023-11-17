import { useEffect, useRef } from "react";

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillRect(0, 0, 100, 100);
  }, []);

  return <canvas ref={canvasRef} />;
};

export default Game;
