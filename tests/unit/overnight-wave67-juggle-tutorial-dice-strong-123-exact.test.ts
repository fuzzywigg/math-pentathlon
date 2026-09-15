/**
 * Wave 67 leftover after tip/#323/#324 — dice strong 1/2/3 exact.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 67 juggle — tutorial dice strong 123 exact', () => {
  it('dice-values strong-marks 1/2/3 cell labels', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'dice-values');
    expect(step?.message).toContain('<li><strong>1</strong> = Monomino (1 cell)</li>');
    expect(step?.message).toContain('<li><strong>2</strong> = Domino (2 cells)</li>');
    expect(step?.message).toContain('<li><strong>3</strong> = Tromino (3 cells)</li>');
  });
});
