/**
 * Wave 64 leftover after tip/#301 + open #303 wave63 — Juggle dice Domino/Tromino/Pentomino.
 * Wave60 locked Monomino only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 64 juggle — tutorial dice Domino Tromino Pentomino', () => {
  it('locks Domino / Tromino / Pentomino dice-value lines', () => {
    const msg =
      juggleTutorial.steps.find((s) => s.id === 'dice-values')?.message ?? '';
    expect(msg).toContain('2</strong> = Domino (2 cells)');
    expect(msg).toContain('3</strong> = Tromino (3 cells)');
    expect(msg).toContain('5-6</strong> = Pentomino (5 cells)');
  });
});
