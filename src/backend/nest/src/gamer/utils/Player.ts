export interface Player {
  name?: string;
  username?: string;
  socket: string;
  room?: string;
  onQueue: boolean;
}
