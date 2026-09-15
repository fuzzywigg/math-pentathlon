/**
 * Wave 67 leftover after tip/#323/#324 — dice strong 4/5-6 exact.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 67 juggle — tutorial dice strong 456 exact', () => {
  it('dice-values strong-marks 4 and 5-6 cell labels', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'dice-values');
    expect(step?.message).toContain('<li><strong>4</strong> = Tetromino (4 cells)</li>');
    expect(step?.message).toContain('<li><strong>5-6</strong> = Pentomino (5 cells)</li>');
  });
});
