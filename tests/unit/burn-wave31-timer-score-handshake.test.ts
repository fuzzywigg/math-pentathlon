/**
 * Wave 31 — timer + scoring cross-domain handshake montage / stress.
 * Existing public APIs only. Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createTimer,
  startTimer,
  pauseTimer,
  stopTimer,
  addTime,
  formatTime,
  parseTime,
  getTimerProgress,
  isTimerWarning,
  isTimerCritical,
  isTimerComplete,
  createScoringState,
  addPlayer,
  removePlayer,
  addScore,
  subtractScore,
  setScore,
  resetScores,
  addMultiplier,
  removeMultiplier,
  checkWinCondition,
  getLeaderboard,
  getLeader,
  calculateGameResult,
  getScoreDifference,
  getRecentEntries,
  setPointValues,
  getPointValue,
  startNewRound,
  getPlayerScore,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(2_000_000);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Wave 31 handshake — timed multiplayer match montage', () => {
  it('runs a countdown match with multipliers, rounds, and result', () => {
    let timer = createTimer({
      direction: 'down',
      initialTime: 60_000,
      warningThreshold: 15_000,
      criticalThreshold: 5_000,
    });
    timer = startTimer(timer);
    expect(timer.state).toBe('running');

    let score = createScoringState(
      {
        winCondition: { type: 'target', value: 50 },
        maxScore: 100,
        minScore: 0,
        pointValues: { hit: 5, miss: 0 },
      },
      ['p1', 'p2'],
      { p1: 'Red', p2: 'Blue' }
    );

    score = setPointValues(score, { bonus: 10 });
    expect(getPointValue(score, 'hit')).toBe(5);
    expect(getPointValue(score, 'bonus')).toBe(10);

    score = addMultiplier(score, { id: 'x2', name: 'Hot', multiplier: 2 });
    score = addScore(score, 'p1', getPointValue(score, 'hit'), 'hit'); // 10
    score = addScore(score, 'p2', getPointValue(score, 'hit'), 'hit'); // 10
    expect(getPlayerScore(score, 'p1')).toBe(10);

    score = removeMultiplier(score, 'x2');
    score = addScore(score, 'p1', getPointValue(score, 'bonus'), 'bonus'); // +10
    expect(getPlayerScore(score, 'p1')).toBe(20);

    timer = addTime(timer, -50_000);
    expect(timer.remaining).toBe(10_000);
    expect(isTimerWarning(timer)).toBe(true);
    expect(isTimerCritical(timer)).toBe(false);

    score = startNewRound(score);
    expect(score.currentRound).toBe(2);
    score = addScore(score, 'p1', 15); // p1 → 35
    score = addScore(score, 'p2', 30); // p2 → 40
    expect(checkWinCondition(score)).toBeNull();

    score = addScore(score, 'p2', 10); // p2 → 50 >= target
    expect(checkWinCondition(score)).toBe('p2');

    timer = addTime(timer, -6_000);
    expect(isTimerCritical(timer)).toBe(true);
    timer = pauseTimer(timer);
    expect(timer.state).toBe('paused');

    const lb = getLeaderboard(score, 'p1');
    expect(lb[0].playerId).toBe('p2');
    expect(getLeader(score)?.playerId).toBe('p2');
    expect(getScoreDifference(score, 'p2', 'p1')).toBe(
      getPlayerScore(score, 'p2') - getPlayerScore(score, 'p1')
    );

    const result = calculateGameResult(score, 60_000 - timer.remaining);
    expect(result.winnerId).toBe('p2');
    expect(result.winnerName).toBe('Blue');
    expect(result.isTie).toBe(false);
    expect(result.finalScores.p1).toBe(getPlayerScore(score, 'p1'));
    expect(result.finalScores.p2).toBe(getPlayerScore(score, 'p2'));

    const formatted = formatTime(timer.remaining, { showMilliseconds: true });
    expect(parseTime(formatted)).toBe(timer.remaining - (timer.remaining % 10));

    timer = stopTimer(timer);
    expect(timer.state).toBe('stopped');
    expect(getTimerProgress(timer)).toBe(100);
  });
});

describe('Wave 31 handshake — stress seats and ledger', () => {
  it('supports many seats with conserved totals and entry counts', () => {
    const ids = Array.from({ length: 24 }, (_, i) => `p${i}`);
    let state = createScoringState({ maxScore: 1_000 }, ids);
    expect(state.players).toHaveLength(24);

    let expectedSum = 0;
    for (let i = 0; i < ids.length; i++) {
      const amount = i + 1;
      state = addScore(state, ids[i], amount, `n${i}`);
      expectedSum += amount;
    }
    const actualSum = state.players.reduce((s, p) => s + p.total, 0);
    expect(actualSum).toBe(expectedSum);

    for (const id of ids) {
      expect(getRecentEntries(state, id, 1)).toHaveLength(1);
    }

    state = removePlayer(state, 'p0');
    expect(state.players).toHaveLength(23);
    expect(getPlayerScore(state, 'p0')).toBe(0);

    state = addPlayer(state, 'late', 'Late');
    state = setScore(state, 'late', 50);
    state = subtractScore(state, 'late', 20);
    expect(getPlayerScore(state, 'late')).toBe(30);

    state = resetScores(state);
    expect(state.players.every((p) => p.total === 0)).toBe(true);
    expect(state.players.every((p) => p.entries.length === 0)).toBe(true);
  });

  it('drains timer to complete while scoring stays independent', () => {
    let timer = createTimer({
      direction: 'down',
      initialTime: 1_000,
      criticalThreshold: 200,
    });
    let score = createScoringState(
      { winCondition: { type: 'exact', value: 8 } },
      ['solo'],
      { solo: 'Solo' }
    );

    for (let i = 0; i < 10; i++) {
      timer = addTime(timer, -100);
      score = addScore(score, 'solo', 1);
    }
    expect(timer.remaining).toBe(0);
    expect(isTimerComplete(timer)).toBe(true);
    expect(isTimerCritical(timer)).toBe(true);
    expect(getPlayerScore(score, 'solo')).toBe(10);
    expect(checkWinCondition(score)).toBeNull(); // 10 !== 8

    score = setScore(score, 'solo', 8);
    expect(checkWinCondition(score)).toBe('solo');
    const result = calculateGameResult(score, 1_000);
    expect(result.winnerId).toBe('solo');
  });
});
