/**
 * Wave 36 — scoring roster stress + winCondition order leftovers.
 * Beyond wave 31 players / config-order. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createScoringState,
  addPlayer,
  removePlayer,
  addScore,
  setScore,
  checkWinCondition,
  getLeaderboard,
  getPlayerScore,
  calculateGameResult,
  resetScores,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(7);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Wave 36 scoring — large roster stress', () => {
  it('creates, scores, and ranks 48 seats with conserved totals', () => {
    const ids = Array.from({ length: 48 }, (_, i) => `seat-${i}`);
    let state = createScoringState(
      { maxScore: 10_000, winCondition: { type: 'highest' } },
      ids
    );
    expect(state.players).toHaveLength(48);

    let expected = 0;
    for (let i = 0; i < ids.length; i++) {
      const amount = (i % 7) + 1;
      state = addScore(state, ids[i]!, amount);
      expected += amount;
    }
    expect(state.players.reduce((s, p) => s + p.total, 0)).toBe(expected);

    const lb = getLeaderboard(state);
    expect(lb).toHaveLength(48);
    expect(lb[0]!.rank).toBe(1);
    expect(lb[47]!.rank).toBe(48);
    // descending totals
    for (let i = 1; i < lb.length; i++) {
      expect(lb[i - 1]!.total).toBeGreaterThanOrEqual(lb[i]!.total);
    }

    expect(checkWinCondition(state)).toBeNull(); // highest is not live
    const result = calculateGameResult(state, 999);
    const top = lb[0]!.total;
    const tied = lb.filter((e) => e.total === top).map((e) => e.playerId);
    if (tied.length > 1) {
      expect(result.isTie).toBe(true);
      expect(result.winnerId).toBeNull();
      expect(result.tiedPlayerIds.sort()).toEqual([...tied].sort());
    } else {
      expect(result.winnerId).toBe(lb[0]!.playerId);
    }
  });

  it('addPlayer is idempotent; removePlayer is idempotent on missing', () => {
    let state = createScoringState({}, ['a']);
    const again = addPlayer(state, 'a', 'Alias');
    expect(again).toBe(state);
    state = removePlayer(state, 'missing');
    expect(state.players.map((p) => p.playerId)).toEqual(['a']);
    state = removePlayer(state, 'a');
    expect(state.players).toHaveLength(0);
    state = removePlayer(state, 'a');
    expect(state.players).toHaveLength(0);
  });
});

describe('Wave 36 scoring — target order after removals', () => {
  it('first remaining roster member at target wins', () => {
    let state = createScoringState(
      { winCondition: { type: 'target', value: 10 } },
      ['a', 'b', 'c']
    );
    state = setScore(state, 'a', 10);
    state = setScore(state, 'b', 10);
    expect(checkWinCondition(state)).toBe('a');
    state = removePlayer(state, 'a');
    expect(checkWinCondition(state)).toBe('b');
    state = setScore(state, 'c', 10);
    expect(checkWinCondition(state)).toBe('b');
  });
});

describe('Wave 36 scoring — resetScores preserves roster and config', () => {
  it('keeps players, names, round, and winCondition after reset', () => {
    let state = createScoringState(
      { winCondition: { type: 'exact', value: 5 }, minScore: 0 },
      ['p1', 'p2'],
      { p1: 'Red', p2: 'Blue' }
    );
    state = addScore(state, 'p1', 5);
    expect(checkWinCondition(state)).toBe('p1');
    state = resetScores(state);
    expect(state.players.map((p) => p.playerName)).toEqual(['Red', 'Blue']);
    expect(state.currentRound).toBe(1);
    expect(state.config.winCondition?.type).toBe('exact');
    expect(getPlayerScore(state, 'p1')).toBe(0);
    expect(checkWinCondition(state)).toBeNull();
  });
});
