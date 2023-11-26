import { Vec2 } from "./Vec2";

export default class Paddle {
  constructor(
    public pos: Vec2,
    public velocity: Vec2,
    public width: number,
    public height: number
  ) {}

  update(keysPressed) {
    if (keysPressed["ArrowUp"]) this.pos.y -= this.velocity.y;
    if (keysPressed["ArrowDown"]) this.pos.y += this.velocity.y;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "white";
    ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
  }

  colisionWithWalls(canvasHeight: number) {
    if (this.pos.y <= 0) this.pos.y = 0;
    if (this.pos.y + this.height >= canvasHeight)
      this.pos.y = canvasHeight - this.height;
  }

  getHalfWidth() {
    return this.width / 2;
  }

  getHalfHeight() {
    return this.height / 2;
  }

  getCenter(): Vec2 {
    return {
      x: this.pos.x + this.getHalfWidth(),
      y: this.pos.y + this.getHalfHeight(),
    };
  }
}
