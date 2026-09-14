/**
 * Wave 41 — Remainder chips exhaust + score draw settle.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { selectIsland, calculateDivision } from '../../src/games/remainder-islands/rules';

describe('Wave 41 remainder — chips exhaust / draw', () => {
  it('both chips depleted ends game; higher score wins', () => {
    const base = createInitialState();
    const island = base.islands[0];
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 5, die2: 6, total: 11 },
      validIslands: [island.id],
      player1Chips: 1,
      player2Chips: 0,
      player1Score: 10,
      player2Score: 3,
      turnsRemaining: 9,
    };
    const next = selectIsland(state, island.id);
    expect(next.phase).toBe('gameOver');
    expect(next.player1Chips).toBe(0);
    expect(next.winner).toBe('player1');
  });

  it('turnsRemaining 1 with equal scores → draw winner null', () => {
    const base = createInitialState();
    const island = base.islands.find((i) => i.value === 5) ?? base.islands[0];
    // total divisible by value → 0 remainder → scores stay equal
    const total = island.value * 2;
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 1, die2: total - 1, total },
      validIslands: [island.id],
      player1Score: 4,
      player2Score: 4,
      turnsRemaining: 1,
    };
    expect(calculateDivision(total, island.value).remainder).toBe(0);
    const next = selectIsland(state, island.id);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBeNull();
    expect(next.player1Score).toBe(4);
  });

  it('own-island reinforce increments chips and keeps owner', () => {
    const base = createInitialState();
    const island = base.islands[0];
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentPlayer: 'player1' as const,
      currentRoll: { die1: 2, die2: 3, total: 5 },
      validIslands: [island.id],
      islands: base.islands.map((i) =>
        i.id === island.id
          ? { ...i, owner: 'player1' as const, chips: 2 }
          : i
      ),
      turnsRemaining: 8,
    };
    const next = selectIsland(state, island.id);
    const updated = next.islands.find((i) => i.id === island.id)!;
    expect(updated.owner).toBe('player1');
    expect(updated.chips).toBe(3);
    expect(next.phase).toBe('rolling');
  });
});
