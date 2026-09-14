/**
 * Wave 44 — Contig placeChip seat flip leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { placeChip } from '../../src/games/contig-60/rules';

describe('Wave 44 Contig — placeChip seat flip', () => {
  it('places, flips seat, clears dice, appends history', () => {
    const base = createInitialState();
    const placed = placeChip(
      { ...base, phase: 'calculating', currentDice: [1, 2, 3] },
      6,
      '1*2*3'
    );
    expect(placed.cells.get(6)?.owner).toBe('player1');
    expect(placed.currentPlayer).toBe('player2');
    expect(placed.currentDice).toBeNull();
    expect(placed.phase).toBe('rolling');
    expect(placed.moveHistory).toHaveLength(1);
  });
});
