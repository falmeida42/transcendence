export interface Room {
  id: string;
  name: string;
  player1: string;
  player2: string;
  againstAi: boolean;
  user2name?: string;
}
