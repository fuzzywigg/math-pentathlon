/**
 * Wave 48 — Remainder selectIsland tie → winner null. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { selectIsland } from '../../src/games/remainder-islands/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 remainder — tie settle', () => {
  it('equal scores at last turn yield null winner', () => {
    const s = createInitialState();
    const island = s.islands.find((i) => i.value === 7) ?? s.islands[0];
    // total divisible by divisor → remainder 0 so scores stay equal if both 0
    const state = {
      ...s,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 3, die2: 4, total: island.value * 2 },
      validIslands: [island.id],
      turnsRemaining: 1,
      player1Score: 0,
      player2Score: 0,
    };
    const next = selectIsland(state, island.id);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBeNull();
  });
});
