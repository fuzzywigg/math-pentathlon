/**
 * Wave 36 — scoring leaderboard dense ranks / ties / lowest leftovers.
 * Beyond wave 31 leaderboard / result-ties. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createScoringState,
  setScore,
  addScore,
  getLeaderboard,
  getLeader,
  calculateGameResult,
  removePlayer,
  startNewRound,
  addMultiplier,
  getPlayerScore,
} from '../../src/core/timer-scoring';

describe('Wave 36 scoring — dense sequential ranks with ties', () => {
  it('assigns ranks 1..n by sort order even when totals tie', () => {
    let state = createScoringState({}, ['a', 'b', 'c'], {
      a: 'A',
      b: 'B',
      c: 'C',
    });
    state = setScore(state, 'a', 10);
    state = setScore(state, 'b', 10);
    state = setScore(state, 'c', 5);
    const lb = getLeaderboard(state);
    expect(lb.map((e) => e.total)).toEqual([10, 10, 5]);
    expect(lb.map((e) => e.rank)).toEqual([1, 2, 3]);
    // Stable relative to sorted array order (not olympic 1,1,3)
    expect(new Set(lb.map((e) => e.playerId))).toEqual(
      new Set(['a', 'b', 'c'])
    );
  });

  it('lowest winCondition reverses sort for ranks and leader', () => {
    let state = createScoringState({ winCondition: { type: 'lowest' } }, [
      'a',
      'b',
      'c',
    ]);
    state = setScore(state, 'a', 30);
    state = setScore(state, 'b', 10);
    state = setScore(state, 'c', 20);
    const lb = getLeaderboard(state, 'c');
    expect(lb[0]?.playerId).toBe('b');
    expect(lb[0]?.rank).toBe(1);
    expect(lb.find((e) => e.playerId === 'c')?.isCurrentPlayer).toBe(true);
    expect(getLeader(state)?.playerId).toBe('b');
  });
});

describe('Wave 36 scoring — calculateGameResult tie expansion', () => {
  it('marks multi-way ties with all tiedPlayerIds', () => {
    let state = createScoringState({}, ['p1', 'p2', 'p3'], {
      p1: 'One',
      p2: 'Two',
      p3: 'Three',
    });
    state = setScore(state, 'p1', 7);
    state = setScore(state, 'p2', 7);
    state = setScore(state, 'p3', 7);
    const result = calculateGameResult(state, 12_000);
    expect(result.isTie).toBe(true);
    expect(result.winnerId).toBeNull();
    expect(result.winnerName).toBeNull();
    expect(result.tiedPlayerIds.sort()).toEqual(['p1', 'p2', 'p3']);
    expect(result.totalDuration).toBe(12_000);
    expect(result.finalScores).toEqual({ p1: 7, p2: 7, p3: 7 });
  });

  it('empty roster yields empty result without tie', () => {
    const state = createScoringState({});
    const result = calculateGameResult(state, 0);
    expect(result.winnerId).toBeNull();
    expect(result.isTie).toBe(false);
    expect(result.tiedPlayerIds).toEqual([]);
    expect(result.finalScores).toEqual({});
  });

  it('lowest ranking affects winner selection in calculateGameResult', () => {
    let state = createScoringState(
      { winCondition: { type: 'lowest' } },
      ['hi', 'lo'],
      { hi: 'High', lo: 'Low' }
    );
    state = setScore(state, 'hi', 100);
    state = setScore(state, 'lo', 1);
    const result = calculateGameResult(state, 500);
    expect(result.winnerId).toBe('lo');
    expect(result.winnerName).toBe('Low');
    expect(result.isTie).toBe(false);
  });
});

describe('Wave 36 scoring — removePlayer and round preserve multipliers', () => {
  it('removing a seat drops them from finalScores and leaderboard', () => {
    let state = createScoringState({}, ['a', 'b', 'c']);
    state = setScore(state, 'a', 5);
    state = setScore(state, 'b', 9);
    state = setScore(state, 'c', 1);
    state = removePlayer(state, 'b');
    const lb = getLeaderboard(state);
    expect(lb.map((e) => e.playerId)).toEqual(['a', 'c']);
    const result = calculateGameResult(state, 100);
    expect(result.finalScores).toEqual({ a: 5, c: 1 });
    expect(result.winnerId).toBe('a');
  });

  it('startNewRound increments round without clearing scores or multipliers', () => {
    let state = createScoringState({}, ['p1']);
    state = addMultiplier(state, { id: 'x2', name: 'x2', multiplier: 2 });
    state = addScore(state, 'p1', 4);
    expect(getPlayerScore(state, 'p1')).toBe(8);
    state = startNewRound(state);
    state = startNewRound(state);
    expect(state.currentRound).toBe(3);
    expect(getPlayerScore(state, 'p1')).toBe(8);
    expect(state.multipliers).toHaveLength(1);
    state = addScore(state, 'p1', 1);
    expect(getPlayerScore(state, 'p1')).toBe(10);
  });
});
