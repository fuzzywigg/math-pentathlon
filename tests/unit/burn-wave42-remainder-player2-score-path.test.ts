/**
 * Wave 42 — Remainder Islands player2 select scores + seat flip.
 * Beyond wave41 player1 score matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import {
  selectIsland,
  calculateDivision,
  countOwnedIslands,
} from '../../src/games/remainder-islands/rules';

describe('Wave 42 remainder — player2 score path', () => {
  it('player2 scores remainder; player1 score untouched', () => {
    const base = createInitialState();
    const island = base.islands[1];
    const total = 10;
    const rem = calculateDivision(total, island.value).remainder;
    const state = {
      ...base,
      currentPlayer: 'player2' as const,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 4, die2: 6, total },
      validIslands: [island.id],
      player1Score: 7,
      player2Score: 2,
      turnsRemaining: 10,
    };
    const next = selectIsland(state, island.id);
    expect(next.player2Score).toBe(2 + rem);
    expect(next.player1Score).toBe(7);
    expect(next.player2Chips).toBe(state.player2Chips - 1);
    expect(next.player1Chips).toBe(state.player1Chips);
    expect(next.currentPlayer).toBe('player1');
    expect(countOwnedIslands(next).player2).toBe(1);
  });

  it('moveHistory records player2 and pointsEarned', () => {
    const base = createInitialState();
    const island = base.islands[0];
    const state = {
      ...base,
      currentPlayer: 'player2' as const,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 5, die2: 5, total: 10 },
      validIslands: [island.id],
      turnsRemaining: 8,
    };
    const next = selectIsland(state, island.id);
    const last = next.moveHistory.at(-1)!;
    expect(last.player).toBe('player2');
    expect(last.pointsEarned).toBe(10 % island.value);
    expect(last.divisionResult.dividend).toBe(10);
    expect(last.island.id).toBe(island.id);
  });
});
