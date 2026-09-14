/**
 * Wave 60 leftover after #282 — Sum passing both-consec copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 60 sum — tutorial passing both consec', () => {
  it('pins both players pass consecutively leftover', () => {
    const byId = Object.fromEntries(sumDominoesTutorial.steps.map((s) => [s.id, s]));
    expect(byId.passing?.message).toMatch(/both players pass consecutively/);
  });
});
