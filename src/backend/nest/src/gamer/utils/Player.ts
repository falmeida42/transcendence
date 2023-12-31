export interface Player {
  name?: string;
  socket: string;
  room?: string;
  onQueue: boolean;
  disconnectedId?: NodeJS.Timeout;
}
