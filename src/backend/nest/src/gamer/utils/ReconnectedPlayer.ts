import { Match } from './Match';
import { Room } from './Room';

export type state = {
  isConnected: boolean;
  username?: string;
  room?: Room;
  match?: Match;
  onQueue: boolean;
  socketId: string;
};
