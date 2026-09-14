/**
 * Wave 43 TOKENMAXX — Contig placeChip score + pass-reset leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { placeChip } from '../../src/games/contig-60/rules';
import { createInitialState } from '../../src/games/contig-60/types';

describe('Wave 43 contig — place score reset', () => {
  it('places chip, awards points, resets consecutive passes, flips seat', () => {
    const base = createInitialState();
    const cells = new Map(base.cells);
    // seed neighbor ownership around 2
    cells.set(1, { ...cells.get(1)!, owner: 'player2' });
    cells.set(3, { ...cells.get(3)!, owner: 'player1' });
    const state = {
      ...base,
      cells,
      phase: 'calculating' as const,
      currentDice: [1, 1, 1] as [number, number, number],
      consecutivePasses: { player1: 2, player2: 0 },
    };
    const next = placeChip(state, 2, '1+1');
    expect(next.cells.get(2)?.owner).toBe('player1');
    expect(next.scores.player1).toBeGreaterThan(0);
    expect(next.consecutivePasses.player1).toBe(0);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
    expect(next.currentDice).toBeNull();
    expect(next.moveHistory).toHaveLength(1);
    expect(next.moveHistory[0].expression).toBe('1+1');
  });
});
