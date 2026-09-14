/**
 * Wave 41 — Timer scoring leaderboard + score difference leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createScoringState,
  addPlayer,
  addScore,
  getLeaderboard,
  getLeader,
  getScoreDifference,
  getPlayerScore,
  subtractScore,
  setScore,
} from '../../src/core/timer-scoring';

describe('Wave 41 timer-scoring — leader / diff', () => {
  it('leaderboard orders by score; difference absolute', () => {
    let state = createScoringState();
    state = addPlayer(state, 'a');
    state = addPlayer(state, 'b');
    state = addScore(state, 'a', 3);
    state = addScore(state, 'b', 10);
    expect(getLeader(state)?.playerId).toBe('b');
    expect(getLeaderboard(state)[0].playerId).toBe('b');
    expect(getScoreDifference(state, 'a', 'b')).toBe(-7);
    expect(getPlayerScore(state, 'a')).toBe(3);
  });

  it('subtractScore floors at configured min; setScore overwrites', () => {
    let state = createScoringState();
    state = addPlayer(state, 'p');
    state = addScore(state, 'p', 5);
    state = subtractScore(state, 'p', 2);
    expect(getPlayerScore(state, 'p')).toBe(3);
    state = setScore(state, 'p', 99);
    expect(getPlayerScore(state, 'p')).toBe(99);
  });
});
