/**
 * Wave 36 — scoring leaderboard tie-rank leftovers (highest mode).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createScoringState,
  setScore,
  getLeaderboard,
  calculateGameResult,
  getLeader,
} from '../../src/core/timer-scoring';

describe('Wave 36 score-leaderboard — ties and current player flag', () => {
  it('assigns sequential ranks even when totals tie', () => {
    let state = createScoringState(
      { winCondition: { type: 'highest' } },
      ['a', 'b', 'c'],
      { a: 'A', b: 'B', c: 'C' }
    );
    state = setScore(state, 'a', 10);
    state = setScore(state, 'b', 10);
    state = setScore(state, 'c', 5);
    const lb = getLeaderboard(state, 'b');
    expect(lb[0]!.total).toBe(10);
    expect(lb[1]!.total).toBe(10);
    expect(lb[2]!.playerId).toBe('c');
    expect(lb.map((e) => e.rank)).toEqual([1, 2, 3]);
    expect(lb.find((e) => e.playerId === 'b')!.isCurrentPlayer).toBe(true);
    expect(lb.filter((e) => e.isCurrentPlayer)).toHaveLength(1);
  });

  it('three-way tie game result lists all tied ids', () => {
    let state = createScoringState({}, ['x', 'y', 'z']);
    state = setScore(state, 'x', 4);
    state = setScore(state, 'y', 4);
    state = setScore(state, 'z', 4);
    const result = calculateGameResult(state, 99);
    expect(result.isTie).toBe(true);
    expect(result.tiedPlayerIds.sort()).toEqual(['x', 'y', 'z']);
    expect(result.winnerName).toBeNull();
  });

  it('getLeader returns a tied player (first on leaderboard)', () => {
    let state = createScoringState({}, ['a', 'b']);
    state = setScore(state, 'a', 1);
    state = setScore(state, 'b', 1);
    const leader = getLeader(state);
    expect(leader).not.toBeNull();
    expect(leader!.playerId).toBe(getLeaderboard(state)[0]!.playerId);
  });
});
