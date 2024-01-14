import { Player } from "./Player";

export interface Room {
  id: string;
  name: string;
  player1: Player;
  player2: Player;
  againstAi: boolean;
}
