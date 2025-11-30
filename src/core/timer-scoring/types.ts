/**
 * Timer and Scoring System Types
 * Core type definitions for game timing and score tracking
 */

// Timer state
export type TimerState = 'stopped' | 'running' | 'paused';

// Timer direction
export type TimerDirection = 'up' | 'down';

// Timer configuration
export interface TimerConfig {
  direction: TimerDirection;
  initialTime: number; // milliseconds
  warningThreshold?: number; // ms remaining to show warning (countdown only)
  criticalThreshold?: number; // ms remaining to show critical (countdown only)
  tickInterval?: number; // update frequency in ms (default 100)
  onTick?: (remaining: number) => void;
  onWarning?: () => void;
  onCritical?: () => void;
  onComplete?: () => void;
}

// Timer instance state
export interface TimerInstance {
  config: TimerConfig;
  state: TimerState;
  elapsed: number; // ms elapsed since start
  remaining: number; // ms remaining (for countdown)
  startTime: number | null; // timestamp when started
  pauseTime: number | null; // timestamp when paused
  intervalId: number | null; // setInterval ID
}

// Default timer config
export const DEFAULT_TIMER_CONFIG: TimerConfig = {
  direction: 'down',
  initialTime: 60000, // 1 minute
  warningThreshold: 10000, // 10 seconds
  criticalThreshold: 5000, // 5 seconds
  tickInterval: 100,
};

// Score entry for a single action
export interface ScoreEntry {
  id: string;
  playerId: string;
  points: number;
  reason: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

// Player score state
export interface PlayerScore {
  playerId: string;
  playerName: string;
  total: number;
  entries: ScoreEntry[];
}

// Scoring configuration
export interface ScoringConfig {
  maxScore?: number; // Optional maximum score
  minScore?: number; // Optional minimum score (can be negative)
  winCondition?: ScoreWinCondition;
  pointValues?: Record<string, number>; // Named point values
  multipliers?: ScoreMultiplier[];
}

// Win condition types
export type ScoreWinCondition =
  | { type: 'highest' } // Player with highest score wins
  | { type: 'lowest' } // Player with lowest score wins
  | { type: 'target'; value: number } // First to reach target wins
  | { type: 'exact'; value: number }; // First to reach exactly this value wins

// Score multipliers
export interface ScoreMultiplier {
  id: string;
  name: string;
  multiplier: number;
  condition?: (entry: ScoreEntry, state: ScoringState) => boolean;
}

// Overall scoring state
export interface ScoringState {
  config: ScoringConfig;
  players: PlayerScore[];
  currentRound: number;
  roundScores: Map<number, PlayerScore[]>; // Scores by round
}

// Default scoring config
export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  winCondition: { type: 'highest' },
  pointValues: {
    default: 1,
  },
};

// Timer display format options
export interface TimerDisplayOptions {
  showMilliseconds: boolean;
  padMinutes: boolean;
  padSeconds: boolean;
  separator: string;
}

export const DEFAULT_TIMER_DISPLAY: TimerDisplayOptions = {
  showMilliseconds: false,
  padMinutes: true,
  padSeconds: true,
  separator: ':',
};

// Score display options
export interface ScoreDisplayOptions {
  showHistory: boolean;
  historyLimit: number;
  showRank: boolean;
  animateChanges: boolean;
}

export const DEFAULT_SCORE_DISPLAY: ScoreDisplayOptions = {
  showHistory: true,
  historyLimit: 5,
  showRank: true,
  animateChanges: true,
};

// Timer visual style
export interface TimerStyle {
  fontSize: number;
  fontFamily: string;
  normalColor: string;
  warningColor: string;
  criticalColor: string;
  backgroundColor: string;
  borderRadius: number;
  padding: number;
}

export const DEFAULT_TIMER_STYLE: TimerStyle = {
  fontSize: 32,
  fontFamily: 'monospace',
  normalColor: '#333',
  warningColor: '#ff9800',
  criticalColor: '#f44336',
  backgroundColor: '#f5f5f5',
  borderRadius: 8,
  padding: 16,
};

// Score visual style
export interface ScoreStyle {
  fontSize: number;
  fontFamily: string;
  textColor: string;
  positiveColor: string;
  negativeColor: string;
  backgroundColor: string;
  highlightColor: string;
  borderRadius: number;
}

export const DEFAULT_SCORE_STYLE: ScoreStyle = {
  fontSize: 24,
  fontFamily: 'sans-serif',
  textColor: '#333',
  positiveColor: '#4caf50',
  negativeColor: '#f44336',
  backgroundColor: '#fff',
  highlightColor: '#e3f2fd',
  borderRadius: 4,
};

// Leaderboard entry
export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  score: number;
  isCurrentPlayer?: boolean;
}

// Round summary
export interface RoundSummary {
  roundNumber: number;
  scores: { playerId: string; playerName: string; roundScore: number; totalScore: number }[];
  duration?: number; // Round duration in ms
  winner?: string; // Player ID of round winner
}

// Game result
export interface GameResult {
  winnerId: string | null; // null for tie
  winnerName: string | null;
  finalScores: PlayerScore[];
  totalDuration: number;
  rounds: RoundSummary[];
  isTie: boolean;
  tiedPlayerIds?: string[];
}
