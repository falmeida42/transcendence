import Ball from "./Ball";
import { Vec2 } from "./Vec2";

export default class Paddle {
  constructor(
    public pos: Vec2,
    public velocity: Vec2,
    public width: number,
    public height: number,
    public side: string
  ) {}

  update(keysPressed: any, ball: Ball) {
    if (this.side === "right") {
      if (keysPressed["ArrowUp"]) this.pos.y -= this.velocity.y;
      if (keysPressed["ArrowDown"]) this.pos.y += this.velocity.y;
    }
    if (this.side === "left") {
      if (keysPressed["w"]) this.pos.y -= this.velocity.y;
      if (keysPressed["s"]) this.pos.y += this.velocity.y;
    }
    if (this.side === "ai") {
      if (ball.pos.y > this.pos.y) {
        this.pos.y += this.velocity.y;
      }

      if (ball.pos.y < this.pos.y) {
        this.pos.y -= this.velocity.y;
      }
    }
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
