/**
 * Wave 36 — scoring lowest winCondition × calculateGameResult leftovers.
 * Leaderboard sorts ascending for lowest; ties share top score.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createScoringState,
  setScore,
  addScore,
  getLeaderboard,
  getLeader,
  calculateGameResult,
  checkWinCondition,
} from '../../src/core/timer-scoring';

describe('Wave 36 score-lowest — leaderboard order', () => {
  it('ranks lowest total as rank 1', () => {
    let state = createScoringState(
      { winCondition: { type: 'lowest' } },
      ['a', 'b', 'c'],
      { a: 'Alice', b: 'Bob', c: 'Cara' }
    );
    state = setScore(state, 'a', 30);
    state = setScore(state, 'b', 10);
    state = setScore(state, 'c', 20);
    const lb = getLeaderboard(state, 'c');
    expect(lb.map((e) => e.playerId)).toEqual(['b', 'c', 'a']);
    expect(lb[0]!.rank).toBe(1);
    expect(lb[2]!.isCurrentPlayer).toBe(false);
    expect(lb[1]!.isCurrentPlayer).toBe(true);
    expect(getLeader(state)?.playerId).toBe('b');
  });

  it('calculateGameResult winner is lowest scorer', () => {
    let state = createScoringState(
      { winCondition: { type: 'lowest' } },
      ['x', 'y']
    );
    state = setScore(state, 'x', 5);
    state = setScore(state, 'y', 8);
    const result = calculateGameResult(state, 12_000);
    expect(result.isTie).toBe(false);
    expect(result.winnerId).toBe('x');
    expect(result.totalDuration).toBe(12_000);
    expect(result.finalScores).toEqual({ x: 5, y: 8 });
  });

  it('lowest tie marks isTie with both ids', () => {
    let state = createScoringState(
      { winCondition: { type: 'lowest' } },
      ['p1', 'p2', 'p3']
    );
    state = setScore(state, 'p1', 7);
    state = setScore(state, 'p2', 7);
    state = setScore(state, 'p3', 9);
    const result = calculateGameResult(state, 1);
    expect(result.isTie).toBe(true);
    expect(result.winnerId).toBeNull();
    expect(result.tiedPlayerIds.sort()).toEqual(['p1', 'p2']);
  });

  it('checkWinCondition still null for lowest (end-of-game only)', () => {
    let state = createScoringState(
      { winCondition: { type: 'lowest' } },
      ['p1']
    );
    state = addScore(state, 'p1', 0);
    expect(checkWinCondition(state)).toBeNull();
  });
});
