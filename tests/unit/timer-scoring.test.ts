/**
 * Timer and Scoring System Unit Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  // Timer
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
  formatTime,
  parseTime,
  getTimerProgress,
  // Scoring
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
  getScoreDifference,
  getRecentEntries,
  calculateGameResult,
  getPointValue,
  setPointValues,
} from '../../src/core/timer-scoring';

describe('Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createTimer', () => {
    it('should create a timer with default config', () => {
      const timer = createTimer();
      expect(timer.state).toBe('stopped');
      expect(timer.elapsed).toBe(0);
      expect(timer.config.direction).toBe('down');
    });

    it('should create a timer with custom config', () => {
      const timer = createTimer({
        direction: 'up',
        initialTime: 30000,
      });
      expect(timer.config.direction).toBe('up');
      expect(timer.config.initialTime).toBe(30000);
      expect(timer.remaining).toBe(30000);
    });
  });

  describe('timer state transitions', () => {
    it('should transition from stopped to running', () => {
      const timer = createTimer();
      const started = startTimer(timer);
      expect(started.state).toBe('running');
      expect(started.startTime).not.toBeNull();
    });

    it('should transition from running to paused', () => {
      let timer = createTimer();
      timer = startTimer(timer);
      const paused = pauseTimer(timer);
      expect(paused.state).toBe('paused');
      expect(paused.pauseTime).not.toBeNull();
    });

    it('should transition from paused to running', () => {
      let timer = createTimer();
      timer = startTimer(timer);
      timer = pauseTimer(timer);
      const resumed = startTimer(timer);
      expect(resumed.state).toBe('running');
    });

    it('should stop and reset timer', () => {
      let timer = createTimer({ initialTime: 60000 });
      timer = startTimer(timer);
      const stopped = stopTimer(timer);
      expect(stopped.state).toBe('stopped');
      expect(stopped.elapsed).toBe(0);
      expect(stopped.remaining).toBe(60000);
    });
  });

  describe('getTimerValue', () => {
    it('should return remaining for countdown', () => {
      const timer = createTimer({
        direction: 'down',
        initialTime: 60000,
      });
      expect(getTimerValue(timer)).toBe(60000);
    });

    it('should return elapsed for count-up', () => {
      const timer = createTimer({
        direction: 'up',
        initialTime: 0,
      });
      expect(getTimerValue(timer)).toBe(0);
    });
  });

  describe('warning and critical states', () => {
    it('should detect warning state', () => {
      const timer = createTimer({
        direction: 'down',
        initialTime: 60000,
        warningThreshold: 10000,
        criticalThreshold: 5000,
      });
      timer.remaining = 8000; // Between warning and critical
      expect(isTimerWarning(timer)).toBe(true);
      expect(isTimerCritical(timer)).toBe(false);
    });

    it('should detect critical state', () => {
      const timer = createTimer({
        direction: 'down',
        initialTime: 60000,
        warningThreshold: 10000,
        criticalThreshold: 5000,
      });
      timer.remaining = 3000; // Below critical
      expect(isTimerWarning(timer)).toBe(false);
      expect(isTimerCritical(timer)).toBe(true);
    });

    it('should not be warning or critical when time is plenty', () => {
      const timer = createTimer({
        direction: 'down',
        initialTime: 60000,
        warningThreshold: 10000,
        criticalThreshold: 5000,
      });
      timer.remaining = 30000;
      expect(isTimerWarning(timer)).toBe(false);
      expect(isTimerCritical(timer)).toBe(false);
    });
  });

  describe('isTimerComplete', () => {
    it('should detect completed countdown', () => {
      const timer = createTimer({ direction: 'down', initialTime: 60000 });
      timer.remaining = 0;
      timer.elapsed = 60000;
      expect(isTimerComplete(timer)).toBe(true);
    });

    it('should not be complete when time remaining', () => {
      const timer = createTimer({ direction: 'down', initialTime: 60000 });
      timer.remaining = 1000;
      expect(isTimerComplete(timer)).toBe(false);
    });
  });

  describe('addTime', () => {
    it('should add time to countdown', () => {
      const timer = createTimer({ direction: 'down', initialTime: 60000 });
      timer.remaining = 30000;
      const updated = addTime(timer, 15000);
      expect(updated.remaining).toBe(45000);
    });

    it('should subtract time with negative value', () => {
      const timer = createTimer({ direction: 'down', initialTime: 60000 });
      timer.remaining = 30000;
      const updated = addTime(timer, -10000);
      expect(updated.remaining).toBe(20000);
    });

    it('should not go below zero', () => {
      const timer = createTimer({ direction: 'down', initialTime: 60000 });
      timer.remaining = 5000;
      const updated = addTime(timer, -10000);
      expect(updated.remaining).toBe(0);
    });
  });

  describe('getTimerProgress', () => {
    it('should return percentage for countdown', () => {
      const timer = createTimer({ direction: 'down', initialTime: 60000 });
      timer.remaining = 30000;
      expect(getTimerProgress(timer)).toBe(50);
    });

    it('should return 100% at start', () => {
      const timer = createTimer({ direction: 'down', initialTime: 60000 });
      expect(getTimerProgress(timer)).toBe(100);
    });

    it('should return 0% when complete', () => {
      const timer = createTimer({ direction: 'down', initialTime: 60000 });
      timer.remaining = 0;
      expect(getTimerProgress(timer)).toBe(0);
    });
  });
});

describe('formatTime', () => {
  it('should format time with default options', () => {
    expect(formatTime(65000)).toBe('01:05');
  });

  it('should format time with milliseconds', () => {
    expect(formatTime(65500, { showMilliseconds: true, padMinutes: true, padSeconds: true, separator: ':' })).toBe('01:05.50');
  });

  it('should format zero', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('should format large values', () => {
    expect(formatTime(3661000)).toBe('61:01'); // 1 hour 1 minute 1 second
  });
});

describe('parseTime', () => {
  it('should parse MM:SS format', () => {
    expect(parseTime('01:30')).toBe(90000);
  });

  it('should parse with milliseconds', () => {
    expect(parseTime('01:30.50')).toBe(90500);
  });

  it('should parse HH:MM:SS format', () => {
    expect(parseTime('01:30:00')).toBe(5400000);
  });
});

describe('Scoring', () => {
  describe('createScoringState', () => {
    it('should create empty scoring state', () => {
      const state = createScoringState();
      expect(state.players).toHaveLength(0);
      expect(state.currentRound).toBe(1);
    });

    it('should create state with players', () => {
      const state = createScoringState({}, ['p1', 'p2'], {
        p1: 'Alice',
        p2: 'Bob',
      });
      expect(state.players).toHaveLength(2);
      expect(state.players[0].playerName).toBe('Alice');
    });
  });

  describe('addPlayer and removePlayer', () => {
    it('should add a player', () => {
      let state = createScoringState();
      state = addPlayer(state, 'p1', 'Alice');
      expect(state.players).toHaveLength(1);
      expect(state.players[0].playerId).toBe('p1');
    });

    it('should not add duplicate player', () => {
      let state = createScoringState({}, ['p1']);
      state = addPlayer(state, 'p1', 'Duplicate');
      expect(state.players).toHaveLength(1);
    });

    it('should remove a player', () => {
      let state = createScoringState({}, ['p1', 'p2']);
      state = removePlayer(state, 'p1');
      expect(state.players).toHaveLength(1);
      expect(state.players[0].playerId).toBe('p2');
    });
  });

  describe('addScore and subtractScore', () => {
    it('should add score to player', () => {
      let state = createScoringState({}, ['p1']);
      state = addScore(state, 'p1', 10, 'test');
      expect(getPlayerScore(state, 'p1')).toBe(10);
    });

    it('should accumulate scores', () => {
      let state = createScoringState({}, ['p1']);
      state = addScore(state, 'p1', 10);
      state = addScore(state, 'p1', 5);
      expect(getPlayerScore(state, 'p1')).toBe(15);
    });

    it('should subtract score', () => {
      let state = createScoringState({}, ['p1']);
      state = addScore(state, 'p1', 10);
      state = subtractScore(state, 'p1', 3);
      expect(getPlayerScore(state, 'p1')).toBe(7);
    });

    it('should respect maxScore', () => {
      let state = createScoringState({ maxScore: 100 }, ['p1']);
      state = addScore(state, 'p1', 150);
      expect(getPlayerScore(state, 'p1')).toBe(100);
    });

    it('should respect minScore', () => {
      let state = createScoringState({ minScore: 0 }, ['p1']);
      state = subtractScore(state, 'p1', 10);
      expect(getPlayerScore(state, 'p1')).toBe(0);
    });
  });

  describe('setScore', () => {
    it('should set score to specific value', () => {
      let state = createScoringState({}, ['p1']);
      state = addScore(state, 'p1', 50);
      state = setScore(state, 'p1', 25);
      expect(getPlayerScore(state, 'p1')).toBe(25);
    });
  });

  describe('resetScores', () => {
    it('should reset all scores to zero', () => {
      let state = createScoringState({}, ['p1', 'p2']);
      state = addScore(state, 'p1', 10);
      state = addScore(state, 'p2', 20);
      state = resetScores(state);
      expect(getPlayerScore(state, 'p1')).toBe(0);
      expect(getPlayerScore(state, 'p2')).toBe(0);
    });
  });

  describe('getPlayerData', () => {
    it('should return player data', () => {
      let state = createScoringState({}, ['p1'], { p1: 'Alice' });
      state = addScore(state, 'p1', 10, 'point');
      const data = getPlayerData(state, 'p1');
      expect(data?.playerName).toBe('Alice');
      expect(data?.total).toBe(10);
      expect(data?.entries).toHaveLength(1);
    });

    it('should return undefined for unknown player', () => {
      const state = createScoringState();
      expect(getPlayerData(state, 'unknown')).toBeUndefined();
    });
  });

  describe('getLeaderboard', () => {
    it('should return sorted leaderboard (highest first)', () => {
      let state = createScoringState({ winCondition: { type: 'highest' } }, ['p1', 'p2', 'p3']);
      state = addScore(state, 'p1', 10);
      state = addScore(state, 'p2', 30);
      state = addScore(state, 'p3', 20);

      const leaderboard = getLeaderboard(state);
      expect(leaderboard[0].playerId).toBe('p2');
      expect(leaderboard[0].rank).toBe(1);
      expect(leaderboard[1].playerId).toBe('p3');
      expect(leaderboard[2].playerId).toBe('p1');
    });

    it('should return sorted leaderboard (lowest first)', () => {
      let state = createScoringState({ winCondition: { type: 'lowest' } }, ['p1', 'p2', 'p3']);
      state = addScore(state, 'p1', 10);
      state = addScore(state, 'p2', 30);
      state = addScore(state, 'p3', 20);

      const leaderboard = getLeaderboard(state);
      expect(leaderboard[0].playerId).toBe('p1');
    });

    it('should highlight current player', () => {
      let state = createScoringState({}, ['p1', 'p2']);
      state = addScore(state, 'p1', 10);
      state = addScore(state, 'p2', 20);

      const leaderboard = getLeaderboard(state, 'p1');
      const p1Entry = leaderboard.find((e) => e.playerId === 'p1');
      expect(p1Entry?.isCurrentPlayer).toBe(true);
    });
  });

  describe('getLeader', () => {
    it('should return leader (highest score)', () => {
      let state = createScoringState({}, ['p1', 'p2']);
      state = addScore(state, 'p1', 10);
      state = addScore(state, 'p2', 20);

      const leader = getLeader(state);
      expect(leader?.playerId).toBe('p2');
    });

    it('should return null for empty state', () => {
      const state = createScoringState();
      expect(getLeader(state)).toBeNull();
    });
  });

  describe('checkWinCondition', () => {
    it('should detect target win condition', () => {
      let state = createScoringState({ winCondition: { type: 'target', value: 100 } }, ['p1', 'p2']);
      state = addScore(state, 'p1', 100);

      expect(checkWinCondition(state)).toBe('p1');
    });

    it('should detect exact win condition', () => {
      let state = createScoringState({ winCondition: { type: 'exact', value: 50 } }, ['p1', 'p2']);
      state = addScore(state, 'p1', 50);

      expect(checkWinCondition(state)).toBe('p1');
    });

    it('should return null when no winner', () => {
      let state = createScoringState({ winCondition: { type: 'target', value: 100 } }, ['p1', 'p2']);
      state = addScore(state, 'p1', 50);

      expect(checkWinCondition(state)).toBeNull();
    });
  });

  describe('multipliers', () => {
    it('should apply multiplier to scores', () => {
      let state = createScoringState({}, ['p1']);
      state = addMultiplier(state, {
        id: 'double',
        name: 'Double Points',
        multiplier: 2,
      });
      state = addScore(state, 'p1', 10);

      expect(getPlayerScore(state, 'p1')).toBe(20);
    });

    it('should remove multiplier', () => {
      let state = createScoringState({}, ['p1']);
      state = addMultiplier(state, {
        id: 'double',
        name: 'Double Points',
        multiplier: 2,
      });
      state = removeMultiplier(state, 'double');
      state = addScore(state, 'p1', 10);

      expect(getPlayerScore(state, 'p1')).toBe(10);
    });
  });

  describe('rounds', () => {
    it('should start new round', () => {
      let state = createScoringState({}, ['p1']);
      expect(state.currentRound).toBe(1);

      state = startNewRound(state);
      expect(state.currentRound).toBe(2);
    });
  });

  describe('getScoreDifference', () => {
    it('should calculate score difference', () => {
      let state = createScoringState({}, ['p1', 'p2']);
      state = addScore(state, 'p1', 30);
      state = addScore(state, 'p2', 10);

      expect(getScoreDifference(state, 'p1', 'p2')).toBe(20);
      expect(getScoreDifference(state, 'p2', 'p1')).toBe(-20);
    });
  });

  describe('getRecentEntries', () => {
    it('should return recent entries', () => {
      let state = createScoringState({}, ['p1']);
      state = addScore(state, 'p1', 10, 'first');
      state = addScore(state, 'p1', 20, 'second');
      state = addScore(state, 'p1', 30, 'third');

      const entries = getRecentEntries(state, 'p1', 2);
      expect(entries).toHaveLength(2);
      expect(entries[0].reason).toBe('third'); // Most recent first
    });
  });

  describe('calculateGameResult', () => {
    it('should calculate game result', () => {
      let state = createScoringState({}, ['p1', 'p2'], { p1: 'Alice', p2: 'Bob' });
      state = addScore(state, 'p1', 30);
      state = addScore(state, 'p2', 20);

      const result = calculateGameResult(state, 120000);
      expect(result.winnerId).toBe('p1');
      expect(result.winnerName).toBe('Alice');
      expect(result.isTie).toBe(false);
      expect(result.totalDuration).toBe(120000);
    });

    it('should detect tie', () => {
      let state = createScoringState({}, ['p1', 'p2']);
      state = addScore(state, 'p1', 20);
      state = addScore(state, 'p2', 20);

      const result = calculateGameResult(state, 60000);
      expect(result.isTie).toBe(true);
      expect(result.winnerId).toBeNull();
      expect(result.tiedPlayerIds).toContain('p1');
      expect(result.tiedPlayerIds).toContain('p2');
    });
  });

  describe('point values', () => {
    it('should get point value from config', () => {
      const state = createScoringState({
        pointValues: { capture: 5, bonus: 10 },
      });
      expect(getPointValue(state, 'capture')).toBe(5);
      expect(getPointValue(state, 'bonus')).toBe(10);
    });

    it('should return default for unknown key', () => {
      const state = createScoringState({
        pointValues: { default: 1 },
      });
      expect(getPointValue(state, 'unknown')).toBe(1);
    });

    it('should set point values', () => {
      let state = createScoringState();
      state = setPointValues(state, { special: 100 });
      expect(getPointValue(state, 'special')).toBe(100);
    });
  });
});
