/**
 * Wave 67 leftover after tip/#316 — Juggle dice-values strong 1-4 exacts.
 * Soft Monomino cell existed; lock strong number leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 67 juggle — tutorial dice strong 1234 exact', () => {
  it('dice-values strong-marks 1-4 category lines', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'dice-values');
    expect(step?.message).toContain('<li><strong>1</strong> = Monomino (1 cell)</li>');
    expect(step?.message).toContain('<li><strong>2</strong> = Domino (2 cells)</li>');
    expect(step?.message).toContain('<li><strong>3</strong> = Tromino (3 cells)</li>');
    expect(step?.message).toContain('<li><strong>4</strong> = Tetromino (4 cells)</li>');
  });
});
