/** Wave 42 — Remainder one seat at 0 chips continues. Tests-only. */
import { describe, it, expect } from 'vitest';

import { selectIsland } from '../../src/games/remainder-islands/rules';
import { createInitialState } from '../../src/games/remainder-islands/types';

describe('Wave 42 remainder — single seat chips zero continues', () => {
  it('p1 has chips, p2 at 0 → select continues rolling', () => {
    const base = createInitialState();
    const island = base.islands[0];
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 3, die2: 4, total: 7 },
      validIslands: [island.id],
      player1Chips: 5,
      player2Chips: 0,
      turnsRemaining: 10,
    };
    const next = selectIsland(state, island.id);
    expect(next.player2Chips).toBe(0);
    expect(next.player1Chips).toBe(4);
    expect(next.phase).toBe('rolling');
    expect(next.winner).toBeNull();
  });

  it('p2 selects while p1 chips already 0 → continues if p2 still has chips', () => {
    const base = createInitialState();
    const island = base.islands[1];
    const state = {
      ...base,
      currentPlayer: 'player2' as const,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 2, die2: 2, total: 4 },
      validIslands: [island.id],
      player1Chips: 0,
      player2Chips: 3,
      turnsRemaining: 8,
    };
    const next = selectIsland(state, island.id);
    expect(next.player1Chips).toBe(0);
    expect(next.player2Chips).toBe(2);
    expect(next.phase).toBe('rolling');
    expect(next.winner).toBeNull();
  });

  it('only both chips ≤0 (with turns left) ends via chip exhaust', () => {
    const base = createInitialState();
    const island = base.islands[0];
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 1, die2: 1, total: 2 },
      validIslands: [island.id],
      player1Chips: 1,
      player2Chips: 0,
      player1Score: 9,
      player2Score: 4,
      turnsRemaining: 6,
    };
    const next = selectIsland(state, island.id);
    expect(next.player1Chips).toBe(0);
    expect(next.player2Chips).toBe(0);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });

  it('p1 at 0 chips does not block p2 from scoring on their turn', () => {
    const base = createInitialState();
    const island = base.islands.find((i) => i.value === 3) ?? base.islands[0];
    const total = 11;
    const state = {
      ...base,
      currentPlayer: 'player2' as const,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 5, die2: 6, total },
      validIslands: [island.id],
      player1Chips: 0,
      player2Chips: 4,
      player2Score: 0,
      turnsRemaining: 5,
    };
    const next = selectIsland(state, island.id);
    expect(next.player2Score).toBe(total % island.value);
    expect(next.phase).toBe('rolling');
  });
});
