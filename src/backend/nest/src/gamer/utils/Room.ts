export interface Room {
  id: string;
  name: string;
  player1: string;
  player2: string;
  againstAi: boolean;
  player2waiting?: string;
}
