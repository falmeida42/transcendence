import { Vec2 } from "./Vec2";

export default class Ball {
  constructor(
    public pos: Vec2,
    public radius: number,
    public velocity: Vec2
  ) {}

  update() {
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#33ff00";
    ctx.strokeStyle = "#33ff00";
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  colisionWithWalls(canvasHeight: number) {
    if (
      this.pos.y + this.radius >= canvasHeight ||
      this.pos.y - this.radius <= 0
    )
      this.velocity.y *= -1;
  }
}
