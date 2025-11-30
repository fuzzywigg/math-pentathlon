/**
 * Timer and Scoring System
 * Reusable timing and score tracking for games
 *
 * Used by: Most competitive games requiring score/time tracking
 */

// Types
export type {
  TimerState,
  TimerDirection,
  TimerConfig,
  TimerInstance,
  TimerDisplayOptions,
  TimerStyle,
  ScoreEntry,
  PlayerScore,
  ScoringConfig,
  ScoreWinCondition,
  ScoreMultiplier,
  ScoringState,
  ScoreDisplayOptions,
  ScoreStyle,
  LeaderboardEntry,
  RoundSummary,
  GameResult,
} from './types';

export {
  DEFAULT_TIMER_CONFIG,
  DEFAULT_TIMER_DISPLAY,
  DEFAULT_TIMER_STYLE,
  DEFAULT_SCORING_CONFIG,
  DEFAULT_SCORE_DISPLAY,
  DEFAULT_SCORE_STYLE,
} from './types';

// Timer operations
export {
  createTimer,
  startTimer,
  pauseTimer,
  stopTimer,
  resetTimer,
  getTimerValue,
  isTimerWarning,
  isTimerCritical,
  isTimerComplete,
  addTime,
  setTimerValue,
  formatTime,
  parseTime,
  countdown,
  stopwatch,
  getTimerProgress,
} from './timer';

// Scoring operations
export {
  createScoringState,
  addPlayer,
  removePlayer,
  addScore,
  subtractScore,
  setScore,
  resetScores,
  getPlayerScore,
  getPlayerData,
  getLeaderboard,
  getLeader,
  checkWinCondition,
  addMultiplier,
  removeMultiplier,
  startNewRound,
  getRoundSummary,
  getScoreDifference,
  getRecentEntries,
  calculateGameResult,
  getPointValue,
  setPointValues,
} from './scoring';

// UI components
export {
  renderTimer,
  renderTimerControls,
  renderPlayerScore,
  renderScoreboard,
  renderLeaderboard,
  renderScoreHistory,
  animateScoreChange,
  getTimerScoringStyles,
  injectTimerScoringStyles,
} from './timer-scoring-ui';
