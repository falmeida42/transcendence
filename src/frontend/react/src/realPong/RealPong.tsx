import { useEffect, useRef } from "react";

type gameProps = {
  width: number;
  height: number;
  againstAi: boolean;
};

const RealPong = ({ width, height, againstAi }: gameProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.height = height;
    canvas.width = width;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationId: number;
    return () => window.cancelAnimationFrame(animationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, againstAi, width]);
};

export default RealPong;
