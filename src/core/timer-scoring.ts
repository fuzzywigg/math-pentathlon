/**
 * Timer and Scoring System
 *
 * Pure, immutable state-based timer and scoring utilities for use in any game.
 */

// ─── Timer ────────────────────────────────────────────────────────────────────

export interface TimerConfig {
  /** Count 'up' (stopwatch) or 'down' (countdown). Default: 'down'. */
  direction: 'up' | 'down';
  /** Initial time in ms. Default: 60000. */
  initialTime: number;
  /** Warning threshold in ms (countdown only). */
  warningThreshold?: number;
  /** Critical threshold in ms (countdown only). */
  criticalThreshold?: number;
}

export type TimerState = 'stopped' | 'running' | 'paused';

export interface Timer {
  config: TimerConfig;
  state: TimerState;
  elapsed: number;
  remaining: number;
  startTime: number | null;
  pauseTime: number | null;
}

const DEFAULT_TIMER_CONFIG: TimerConfig = {
  direction: 'down',
  initialTime: 60000,
};

/** Create a new timer with optional config overrides. */
export function createTimer(config: Partial<TimerConfig> = {}): Timer {
  const full: TimerConfig = { ...DEFAULT_TIMER_CONFIG, ...config };
  return {
    config: full,
    state: 'stopped',
    elapsed: 0,
    remaining: full.initialTime,
    startTime: null,
    pauseTime: null,
  };
}

/** Start or resume a timer. */
export function startTimer(timer: Timer): Timer {
  if (timer.state === 'running') return timer;
  return {
    ...timer,
    state: 'running',
    startTime: Date.now(),
    pauseTime: null,
  };
}

/** Pause a running timer. */
export function pauseTimer(timer: Timer): Timer {
  if (timer.state !== 'running') return timer;
  return {
    ...timer,
    state: 'paused',
    pauseTime: Date.now(),
  };
}

/** Stop a timer and reset elapsed/remaining to initial values. */
export function stopTimer(timer: Timer): Timer {
  return {
    ...timer,
    state: 'stopped',
    elapsed: 0,
    remaining: timer.config.initialTime,
    startTime: null,
    pauseTime: null,
  };
}

/** Reset a timer (alias for stopTimer). */
export function resetTimer(timer: Timer): Timer {
  return stopTimer(timer);
}

/**
 * Return the "display value" for the timer:
 * - For countdown ('down'): returns `remaining`.
 * - For count-up ('up'): returns `elapsed`.
 */
export function getTimerValue(timer: Timer): number {
  return timer.config.direction === 'up' ? timer.elapsed : timer.remaining;
}

/** True when remaining ≤ warningThreshold but > criticalThreshold. */
export function isTimerWarning(timer: Timer): boolean {
  const { warningThreshold, criticalThreshold } = timer.config;
  if (warningThreshold === undefined) return false;
  const critical = criticalThreshold ?? 0;
  return timer.remaining <= warningThreshold && timer.remaining > critical;
}

/** True when remaining ≤ criticalThreshold. */
export function isTimerCritical(timer: Timer): boolean {
  const { criticalThreshold } = timer.config;
  if (criticalThreshold === undefined) return false;
  return timer.remaining <= criticalThreshold;
}

/** True when countdown is complete (remaining ≤ 0). */
export function isTimerComplete(timer: Timer): boolean {
  if (timer.config.direction === 'down') {
    return timer.remaining <= 0;
  }
  return false;
}

/** Add (or subtract if negative) milliseconds to remaining. Clamps to [0, ∞). */
export function addTime(timer: Timer, ms: number): Timer {
  return {
    ...timer,
    remaining: Math.max(0, timer.remaining + ms),
  };
}

export interface FormatTimeOptions {
  showMilliseconds?: boolean;
  padMinutes?: boolean;
  padSeconds?: boolean;
  separator?: string;
}

/**
 * Format a duration (in ms) as MM:SS or MM:SS.cs.
 * By default pads both minutes and seconds with leading zeros.
 */
export function formatTime(ms: number, options: FormatTimeOptions = {}): string {
  const {
    showMilliseconds = false,
    padMinutes = true,
    padSeconds = true,
    separator = ':',
  } = options;

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  const minStr = padMinutes ? String(minutes).padStart(2, '0') : String(minutes);
  const secStr = padSeconds ? String(seconds).padStart(2, '0') : String(seconds);

  let result = `${minStr}${separator}${secStr}`;
  if (showMilliseconds) {
    result += `.${String(centiseconds).padStart(2, '0')}`;
  }
  return result;
}

/**
 * Parse a time string into milliseconds.
 * Supports: MM:SS, MM:SS.cs, HH:MM:SS.
 */
export function parseTime(str: string): number {
  const parts = str.split(':');
  if (parts.length === 3) {
    // HH:MM:SS
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const s = parseInt(parts[2], 10);
    return (h * 3600 + m * 60 + s) * 1000;
  }
  // MM:SS or MM:SS.cs
  const m = parseInt(parts[0], 10);
  const secParts = parts[1].split('.');
  const s = parseInt(secParts[0], 10);
  const cs = secParts[1] ? parseInt(secParts[1].padEnd(2, '0').slice(0, 2), 10) : 0;
  return (m * 60 + s) * 1000 + cs * 10;
}

/**
 * Return timer progress as a percentage [0, 100].
 * For countdown: (remaining / initialTime) * 100.
 */
export function getTimerProgress(timer: Timer): number {
  const { initialTime } = timer.config;
  if (initialTime === 0) return 0;
  if (timer.config.direction === 'up') {
    return Math.min(100, (timer.elapsed / initialTime) * 100);
  }
  return Math.min(100, (timer.remaining / initialTime) * 100);
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

export interface ScoreEntry {
  amount: number;
  reason?: string;
  timestamp: number;
}

export interface PlayerData {
  playerId: string;
  playerName: string;
  total: number;
  entries: ScoreEntry[];
}

export interface WinCondition {
  /** 'highest', 'lowest', 'target' (first to reach), 'exact' (exactly equals). */
  type: 'highest' | 'lowest' | 'target' | 'exact';
  value?: number;
}

export interface Multiplier {
  id: string;
  name: string;
  multiplier: number;
}

export interface ScoringConfig {
  winCondition?: WinCondition;
  maxScore?: number;
  minScore?: number;
  pointValues?: Record<string, number>;
}

export interface ScoringState {
  config: ScoringConfig;
  players: PlayerData[];
  multipliers: Multiplier[];
  currentRound: number;
}

export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  total: number;
  rank: number;
  isCurrentPlayer: boolean;
}

export interface GameResult {
  winnerId: string | null;
  winnerName: string | null;
  isTie: boolean;
  tiedPlayerIds: string[];
  totalDuration: number;
  finalScores: Record<string, number>;
}

/** Create a new, empty scoring state. */
export function createScoringState(
  config: ScoringConfig = {},
  playerIds: string[] = [],
  names: Record<string, string> = {}
): ScoringState {
  const state: ScoringState = {
    config,
    players: [],
    multipliers: [],
    currentRound: 1,
  };
  let current = state;
  for (const id of playerIds) {
    current = addPlayer(current, id, names[id] ?? id);
  }
  return current;
}

/** Add a player to the scoring state (no-op if already present). */
export function addPlayer(
  state: ScoringState,
  playerId: string,
  playerName?: string
): ScoringState {
  if (state.players.some((p) => p.playerId === playerId)) return state;
  return {
    ...state,
    players: [
      ...state.players,
      { playerId, playerName: playerName ?? playerId, total: 0, entries: [] },
    ],
  };
}

/** Remove a player from the scoring state. */
export function removePlayer(state: ScoringState, playerId: string): ScoringState {
  return {
    ...state,
    players: state.players.filter((p) => p.playerId !== playerId),
  };
}

function applyMultipliers(amount: number, multipliers: Multiplier[]): number {
  return multipliers.reduce((acc, m) => acc * m.multiplier, amount);
}

function clampScore(
  score: number,
  config: ScoringConfig
): number {
  let s = score;
  if (config.maxScore !== undefined) s = Math.min(s, config.maxScore);
  if (config.minScore !== undefined) s = Math.max(s, config.minScore);
  return s;
}

/** Add points to a player's score. */
export function addScore(
  state: ScoringState,
  playerId: string,
  amount: number,
  reason?: string
): ScoringState {
  const effective = applyMultipliers(amount, state.multipliers);
  return {
    ...state,
    players: state.players.map((p) => {
      if (p.playerId !== playerId) return p;
      const newTotal = clampScore(p.total + effective, state.config);
      return {
        ...p,
        total: newTotal,
        entries: [
          ...p.entries,
          { amount: effective, reason, timestamp: Date.now() },
        ],
      };
    }),
  };
}

/** Subtract points from a player's score. */
export function subtractScore(
  state: ScoringState,
  playerId: string,
  amount: number,
  reason?: string
): ScoringState {
  return addScore(state, playerId, -amount, reason);
}

/** Set a player's score to an exact value. */
export function setScore(
  state: ScoringState,
  playerId: string,
  value: number
): ScoringState {
  return {
    ...state,
    players: state.players.map((p) => {
      if (p.playerId !== playerId) return p;
      const clamped = clampScore(value, state.config);
      return {
        ...p,
        total: clamped,
        entries: [
          ...p.entries,
          { amount: clamped - p.total, reason: 'set', timestamp: Date.now() },
        ],
      };
    }),
  };
}

/** Reset all players' scores to zero. */
export function resetScores(state: ScoringState): ScoringState {
  return {
    ...state,
    players: state.players.map((p) => ({ ...p, total: 0, entries: [] })),
  };
}

/** Get a player's current total score. Returns 0 for unknown players. */
export function getPlayerScore(state: ScoringState, playerId: string): number {
  return state.players.find((p) => p.playerId === playerId)?.total ?? 0;
}

/** Get full data for a player. Returns undefined for unknown players. */
export function getPlayerData(
  state: ScoringState,
  playerId: string
): PlayerData | undefined {
  return state.players.find((p) => p.playerId === playerId);
}

/** Return players ranked by score. Pass currentPlayerId to flag them. */
export function getLeaderboard(
  state: ScoringState,
  currentPlayerId?: string
): LeaderboardEntry[] {
  const isLowest = state.config.winCondition?.type === 'lowest';
  const sorted = [...state.players].sort((a, b) =>
    isLowest ? a.total - b.total : b.total - a.total
  );
  return sorted.map((p, i) => ({
    playerId: p.playerId,
    playerName: p.playerName,
    total: p.total,
    rank: i + 1,
    isCurrentPlayer: p.playerId === currentPlayerId,
  }));
}

/** Return the leading player, or null if no players. */
export function getLeader(state: ScoringState): PlayerData | null {
  if (state.players.length === 0) return null;
  const lb = getLeaderboard(state);
  return state.players.find((p) => p.playerId === lb[0].playerId) ?? null;
}

/**
 * Check the win condition. Returns the winning playerId, or null if no winner yet.
 */
export function checkWinCondition(state: ScoringState): string | null {
  const { winCondition } = state.config;
  if (!winCondition) return null;

  for (const player of state.players) {
    if (winCondition.type === 'target' && winCondition.value !== undefined) {
      if (player.total >= winCondition.value) return player.playerId;
    } else if (winCondition.type === 'exact' && winCondition.value !== undefined) {
      if (player.total === winCondition.value) return player.playerId;
    }
  }
  return null;
}

/** Add a score multiplier. */
export function addMultiplier(state: ScoringState, multiplier: Multiplier): ScoringState {
  return {
    ...state,
    multipliers: [...state.multipliers.filter((m) => m.id !== multiplier.id), multiplier],
  };
}

/** Remove a multiplier by id. */
export function removeMultiplier(state: ScoringState, id: string): ScoringState {
  return {
    ...state,
    multipliers: state.multipliers.filter((m) => m.id !== id),
  };
}

/** Advance to the next round. */
export function startNewRound(state: ScoringState): ScoringState {
  return { ...state, currentRound: state.currentRound + 1 };
}

/** Return the score difference (player1 - player2). */
export function getScoreDifference(
  state: ScoringState,
  playerId1: string,
  playerId2: string
): number {
  return getPlayerScore(state, playerId1) - getPlayerScore(state, playerId2);
}

/** Return the most recent N score entries for a player (most recent first). */
export function getRecentEntries(
  state: ScoringState,
  playerId: string,
  count: number
): ScoreEntry[] {
  const player = getPlayerData(state, playerId);
  if (!player) return [];
  return [...player.entries].reverse().slice(0, count);
}

/** Calculate the final game result. */
export function calculateGameResult(
  state: ScoringState,
  totalDuration: number
): GameResult {
  const lb = getLeaderboard(state);
  const finalScores: Record<string, number> = {};
  for (const p of state.players) {
    finalScores[p.playerId] = p.total;
  }

  if (lb.length === 0) {
    return { winnerId: null, winnerName: null, isTie: false, tiedPlayerIds: [], totalDuration, finalScores };
  }

  const topScore = lb[0].total;
  const tied = lb.filter((e) => e.total === topScore);

  if (tied.length > 1) {
    return {
      winnerId: null,
      winnerName: null,
      isTie: true,
      tiedPlayerIds: tied.map((e) => e.playerId),
      totalDuration,
      finalScores,
    };
  }

  return {
    winnerId: lb[0].playerId,
    winnerName: lb[0].playerName,
    isTie: false,
    tiedPlayerIds: [],
    totalDuration,
    finalScores,
  };
}

/** Get the point value for a named action, falling back to 'default' if defined. */
export function getPointValue(state: ScoringState, key: string): number {
  const pv = state.config.pointValues;
  if (!pv) return 0;
  if (key in pv) return pv[key];
  return pv['default'] ?? 0;
}

/** Merge new point values into the scoring config. */
export function setPointValues(
  state: ScoringState,
  values: Record<string, number>
): ScoringState {
  return {
    ...state,
    config: {
      ...state.config,
      pointValues: { ...(state.config.pointValues ?? {}), ...values },
    },
  };
}
