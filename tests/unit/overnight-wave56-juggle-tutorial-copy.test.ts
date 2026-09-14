/**
 * Wave 56 leftover after #256 — Juggle tutorial copy leftovers.
 * Distinct from wave50 calla tutorial copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 56 juggle — tutorial copy', () => {
  it('keeps 9x9 / pentomino / finish teaching fragments', () => {
    const byId = Object.fromEntries(
      juggleTutorial.steps.map((s) => [s.id, s])
    );
    expect(byId['welcome']?.message).toMatch(/9x9/);
    expect(byId['objective']?.message).toMatch(/9x9/);
    expect(byId['dice-values']?.message).toMatch(/5-6/);
    expect(byId['dice-values']?.message).toMatch(/Pentomino/);
    expect(byId['strategy-tips']?.message).toMatch(/gaps|larger shapes/i);
    expect(byId['complete']?.message).toMatch(/Finish/);
  });
});
