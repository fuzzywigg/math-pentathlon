/**
 * Wave 44 — Contig placeChip resets consecutive passes.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { placeChip } from '../../src/games/contig-60/rules';

describe('Wave 44 Contig — placeChip pass reset', () => {
  it('resets current player consecutivePasses to 0', () => {
    const base = createInitialState();
    const next = placeChip(
      {
        ...base,
        phase: 'calculating',
        currentDice: [2, 3, 4],
        consecutivePasses: { player1: 2, player2: 1 },
      },
      24,
      '2*3*4'
    );
    expect(next.consecutivePasses.player1).toBe(0);
    expect(next.consecutivePasses.player2).toBe(1);
  });
});
