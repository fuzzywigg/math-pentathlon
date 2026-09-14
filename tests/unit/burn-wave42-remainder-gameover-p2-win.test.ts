/**
 * Wave 42 — Remainder Islands gameOver player2 win / single-chip non-end.
 * Beyond wave41 p1 win and draw. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { selectIsland } from '../../src/games/remainder-islands/rules';

describe('Wave 42 remainder — gameOver p2 win', () => {
  it('final turn with player2 ahead yields player2 winner', () => {
    const base = createInitialState();
    const island = base.islands.find((i) => i.value === 5) ?? base.islands[0];
    // 0 remainder so p2 score stays ahead
    const total = island.value * 2;
    const state = {
      ...base,
      currentPlayer: 'player2' as const,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 1, die2: total - 1, total },
      validIslands: [island.id],
      player1Score: 3,
      player2Score: 8,
      turnsRemaining: 1,
    };
    const next = selectIsland(state, island.id);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player2');
    expect(next.currentPlayer).toBe('player2');
  });

  it('only one side at 0 chips does not end when turns remain', () => {
    const base = createInitialState();
    const island = base.islands[0];
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 2, die2: 3, total: 5 },
      validIslands: [island.id],
      player1Chips: 1,
      player2Chips: 5,
      turnsRemaining: 6,
    };
    const next = selectIsland(state, island.id);
    expect(next.player1Chips).toBe(0);
    expect(next.player2Chips).toBe(5);
    expect(next.phase).toBe('rolling');
    expect(next.winner).toBeNull();
  });
});
