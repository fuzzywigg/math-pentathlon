/**
 * Wave 60 leftover after #282 — Sum strategy high-pip copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 60 sum — tutorial strategy high-pip', () => {
  it('pins high-pip and Watch which sums leftovers', () => {
    const byId = Object.fromEntries(sumDominoesTutorial.steps.map((s) => [s.id, s]));
    expect(byId['strategy-tips']?.message).toMatch(/high-pip/);
    expect(byId['strategy-tips']?.message).toMatch(/Watch which sums/);
  });
});
