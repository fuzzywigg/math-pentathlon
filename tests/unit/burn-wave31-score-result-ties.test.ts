/**
 * Wave 31 — calculateGameResult winners / ties / empty / lowest ranking.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createScoringState,
  addScore,
  setScore,
  calculateGameResult,
  getLeaderboard,
} from '../../src/core/timer-scoring';

describe('Wave 31 scoring — calculateGameResult winners', () => {
  it('returns sole leader with name and finalScores map', () => {
    let state = createScoringState({}, ['p1', 'p2'], {
      p1: 'Ada',
      p2: 'Bo',
    });
    state = addScore(state, 'p1', 15);
    state = addScore(state, 'p2', 9);
    const result = calculateGameResult(state, 42_000);
    expect(result).toEqual({
      winnerId: 'p1',
      winnerName: 'Ada',
      isTie: false,
      tiedPlayerIds: [],
      totalDuration: 42_000,
      finalScores: { p1: 15, p2: 9 },
    });
  });

  it('empty roster → null winner, empty scores', () => {
    const result = calculateGameResult(createScoringState(), 0);
    expect(result.winnerId).toBeNull();
    expect(result.winnerName).toBeNull();
    expect(result.isTie).toBe(false);
    expect(result.tiedPlayerIds).toEqual([]);
    expect(result.finalScores).toEqual({});
    expect(result.totalDuration).toBe(0);
  });
});

describe('Wave 31 scoring — ties', () => {
  it('two-way tie clears winner and lists both ids', () => {
    let state = createScoringState({}, ['a', 'b', 'c']);
    state = setScore(state, 'a', 10);
    state = setScore(state, 'b', 10);
    state = setScore(state, 'c', 3);
    const result = calculateGameResult(state, 1);
    expect(result.isTie).toBe(true);
    expect(result.winnerId).toBeNull();
    expect(result.winnerName).toBeNull();
    expect(result.tiedPlayerIds.sort()).toEqual(['a', 'b']);
    expect(result.finalScores).toEqual({ a: 10, b: 10, c: 3 });
  });

  it('three-way all-equal tie', () => {
    let state = createScoringState({}, ['x', 'y', 'z']);
    state = setScore(state, 'x', 7);
    state = setScore(state, 'y', 7);
    state = setScore(state, 'z', 7);
    const result = calculateGameResult(state, 99);
    expect(result.isTie).toBe(true);
    expect(result.tiedPlayerIds.sort()).toEqual(['x', 'y', 'z']);
  });

  it('lowest winCondition ties on lowest shared total', () => {
    let state = createScoringState({ winCondition: { type: 'lowest' } }, [
      'p1',
      'p2',
      'p3',
    ]);
    state = setScore(state, 'p1', 2);
    state = setScore(state, 'p2', 2);
    state = setScore(state, 'p3', 9);
    const lb = getLeaderboard(state);
    expect(lb[0].total).toBe(2);
    const result = calculateGameResult(state, 5);
    expect(result.isTie).toBe(true);
    expect(result.tiedPlayerIds.sort()).toEqual(['p1', 'p2']);
  });

  it('lowest sole leader is winner', () => {
    let state = createScoringState(
      { winCondition: { type: 'lowest' } },
      ['p1', 'p2'],
      { p1: 'Low', p2: 'High' }
    );
    state = setScore(state, 'p1', 1);
    state = setScore(state, 'p2', 50);
    const result = calculateGameResult(state, 10);
    expect(result.isTie).toBe(false);
    expect(result.winnerId).toBe('p1');
    expect(result.winnerName).toBe('Low');
  });
});

describe('Wave 31 scoring — duration passthrough', () => {
  it('preserves arbitrary totalDuration including zero and large', () => {
    const state = createScoringState({}, ['p1']);
    expect(calculateGameResult(state, 0).totalDuration).toBe(0);
    expect(calculateGameResult(state, 86_400_000).totalDuration).toBe(
      86_400_000
    );
  });
});
