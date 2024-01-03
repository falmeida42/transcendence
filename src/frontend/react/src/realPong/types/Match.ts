export interface playerConfig {
  ready: boolean;
  name: string;
  x: number;
  y: number;
  height: number;
  width: number;
  speed: number;
}

interface gameConfig {
  width: number;
  height: number;
  maxScore: number;
}

export interface ballConfig {
  x: number;
  y: number;
  radius: number;
  velocity: {
    x: number;
    y: number;
  };
}

export interface Match {
  gameConfig: gameConfig;
  player1: playerConfig;
  player2: playerConfig;
  ball: ballConfig;
  score1: number;
  score2: number;
  status: "START" | "PLAY" | "END";
}
