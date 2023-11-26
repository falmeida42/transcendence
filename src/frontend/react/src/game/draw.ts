import gameElements from "./gameElements";

export const draw_field = (
  ctx: CanvasRenderingContext2D,
  windowWidth: number,
  windowHeight: number
) => {
  // Background
  // ctx.fillStyle = "black";
  // ctx.fillRect(0, 0, windowWidth, windowHeight);

  // Middle line
  ctx.beginPath();
  ctx.moveTo(windowWidth / 2, 0);
  ctx.lineTo(windowWidth / 2, windowHeight);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Middle circle
  ctx.beginPath();
  ctx.arc(windowWidth / 2, windowHeight / 2, windowHeight / 4, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.arc(windowWidth / 2, windowHeight / 2, 10, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
};

export const draw = (
  ctx: CanvasRenderingContext2D,
  gameElements: gameElements
) => {
  gameElements.ball.draw(ctx);
  gameElements.paddleLeft.draw(ctx);
  gameElements.paddleRight.draw(ctx);
};
