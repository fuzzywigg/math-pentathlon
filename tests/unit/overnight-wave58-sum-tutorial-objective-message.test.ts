/**
 * Wave 58 leftover after #275 — Sum tutorial objective message. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 58 sum — tutorial objective message', () => {
  it('pins leftover', () => {
    const byId = Object.fromEntries(sumDominoesTutorial.steps.map((s) => [s.id, s]));
    expect(byId.objective?.message).toMatch(/get rid of all your dominoes/);
  });
});
