/**
 * Wave 42 — Remainder selectIsland reject + turns/chips gameOver. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { selectIsland } from '../../src/games/remainder-islands/rules';
import { createInitialState, type RemainderIslandsState } from '../../src/games/remainder-islands/types';

function base(): RemainderIslandsState {
  const s = createInitialState();
  return {
    ...s,
    phase: 'selectIsland',
    currentRoll: { die1: 6, die2: 6, total: 12 },
    validIslands: [s.islands[0].id, s.islands[1].id],
  };
}

describe('Wave 42 remainder — select reject / gameOver', () => {
  it('invalid island / wrong phase / missing roll identity', () => {
    const s = base();
    expect(selectIsland(s, 'nope')).toBe(s);
    const rolling = { ...s, phase: 'rolling' as const };
    expect(selectIsland(rolling, s.islands[0].id)).toBe(rolling);
    const noRoll = { ...s, currentRoll: null };
    expect(selectIsland(noRoll, s.islands[0].id)).toBe(noRoll);
  });

  it('turnsRemaining 1 → gameOver with score winner', () => {
    const s = {
      ...base(),
      turnsRemaining: 1,
      player1Score: 10,
      player2Score: 3,
    };
    const next = selectIsland(s, s.islands[0].id);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });

  it('both chips 0 after select → gameOver draw on equal scores', () => {
    const s = {
      ...base(),
      player1Chips: 1,
      player2Chips: 0,
      player1Score: 5,
      player2Score: 5,
    };
    const next = selectIsland(s, s.islands[0].id);
    expect(next.player1Chips).toBe(0);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBeNull();
  });
});
