import { gameConfig } from './gameConfig';

export interface playerConfig {
  id: string;
  name: string;
  ready: boolean;
  x: number;
  y: number;
  height: number;
  width: number;
  speed: number;
  direction: 'ArrowUp' | 'ArrowDown' | 'STOP';
}

interface ballConfig {
  x: number;
  y: number;
  radius: number;
  x_speed: number;
  y_speed: number;
  x_direction: number;
  y_direction: number;
}

export interface Match {
  gameConfig: typeof gameConfig;
  player1: playerConfig;
  player2: playerConfig;
  ball: ballConfig;
  score1: number;
  score2: number;
  status: 'START' | 'PLAY' | 'PAUSE' | 'END';
}
