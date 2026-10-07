/** Shared types for headless AI calibration matrices. */

export type Difficulty = 'easy' | 'medium' | 'hard';
export type Policy = Difficulty | 'random';
export type Seat = 'player1' | 'player2';

export type Outcome = 'player1' | 'player2' | 'draw';

export interface GameResult {
  winner: Outcome;
  length: number;
  seed: number;
}

export interface MatchupStats {
  games: number;
  p1Wins: number;
  p2Wins: number;
  draws: number;
  avgLength: number;
  p1WinRate: number;
  p2WinRate: number;
  drawRate: number;
}

export interface CalibrationFlag {
  kind: 'easy-beats-hard' | 'indistinguishable';
  detail: string;
}

export interface GameAdapter {
  id: string;
  /** Play one full game; policies control each seat's move selection. */
  play(p1: Policy, p2: Policy, seed: number): GameResult;
}
