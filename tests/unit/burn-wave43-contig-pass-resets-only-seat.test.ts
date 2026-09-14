/**
 * Wave 43 — Contig placeChip resets only current seat passes. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { placeChip } from '../../src/games/contig-60/rules';

describe('Wave 43 contig — pass reset seat-local', () => {
  it('placing resets player1 consecutivePasses only', () => {
    const state = {
      ...createInitialState(),
      phase: 'calculating' as const,
      currentDice: [1, 2, 3] as [number, number, number],
      consecutivePasses: { player1: 2, player2: 2 },
    };
    const next = placeChip(state, 1, 'forged');
    expect(next.consecutivePasses.player1).toBe(0);
    expect(next.consecutivePasses.player2).toBe(2);
  });
});
