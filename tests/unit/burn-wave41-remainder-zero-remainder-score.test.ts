/**
 * Wave 41 — Remainder zero-remainder place still owns island.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { selectIsland, calculateDivision } from '../../src/games/remainder-islands/rules';

describe('Wave 41 remainder — zero remainder place', () => {
  it('divisible roll scores 0 but claims island', () => {
    const base = createInitialState();
    const island = base.islands.find((i) => i.value === 4) ?? base.islands[0];
    const total = island.value * 3;
    expect(calculateDivision(total, island.value).remainder).toBe(0);
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 2, die2: total - 2, total },
      validIslands: [island.id],
      player1Score: 5,
      turnsRemaining: 6,
    };
    const next = selectIsland(state, island.id);
    expect(next.player1Score).toBe(5);
    expect(next.islands.find((i) => i.id === island.id)!.owner).toBe('player1');
    expect(next.moveHistory.at(-1)?.pointsEarned).toBe(0);
  });
});
