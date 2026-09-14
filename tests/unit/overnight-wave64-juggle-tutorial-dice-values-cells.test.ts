/**
 * Wave 64 leftover after tip/#303 — Juggle dice-values cell-count exacts.
 * Soft Monomino/Tromino labels elsewhere; lock (N cells) leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 64 juggle — tutorial dice values cells', () => {
  it('locks Monomino–Pentomino cell-count bullets', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'dice-values');
    expect(step?.title).toBe('Dice Values');
    expect(step?.message).toContain('Monomino (1 cell)');
    expect(step?.message).toContain('Domino (2 cells)');
    expect(step?.message).toContain('Tromino (3 cells)');
    expect(step?.message).toContain('Tetromino (4 cells)');
    expect(step?.message).toContain('Pentomino (5 cells)');
  });
});
