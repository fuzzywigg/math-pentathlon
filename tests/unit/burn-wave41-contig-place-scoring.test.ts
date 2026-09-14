/**
 * Wave 41 — Contig 60 hasValidMoves / place scoring handshake leftovers.
 * Adjacent points applied on legal placeChip. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/contig-60/types';
import {
  placeChip,
  calculatePoints,
  hasValidMoves,
  checkWinner,
} from '../../src/games/contig-60/rules';

describe('Wave 41 contig-60 — place scoring handshake', () => {
  it('placeChip awards calculatePoints into scores', () => {
    const state = {
      ...createInitialState(),
      phase: 'calculating' as const,
      currentDice: [2, 3, 4] as [number, number, number],
    };
    // Seed neighbors of cell 5
    state.cells.get(4)!.owner = 'player2';
    state.cells.get(6)!.owner = 'player1';
    const expected = calculatePoints(state, 5);
    expect(expected).toBeGreaterThan(0);
    const next = placeChip(state, 5, '2+3');
    expect(next.scores.player1).toBe(expected);
    expect(next.consecutivePasses.player1).toBe(0);
  });

  it('hasValidMoves true for [1,1,1] on open board', () => {
    const state = {
      ...createInitialState(),
      currentDice: [1, 1, 1] as [number, number, number],
    };
    expect(hasValidMoves(state)).toBe(true);
  });

  it('checkWinner ignores partial equal scores without alignment', () => {
    const state = createInitialState();
    state.cells.get(1)!.owner = 'player1';
    state.cells.get(216)!.owner = 'player2';
    expect(
      checkWinner({ ...state, scores: { player1: 7, player2: 7 } })
    ).toBeNull();
  });
});
