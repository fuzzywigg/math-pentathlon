/**
 * Wave 60 leftover after #282 — Sum matching connect copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 60 sum — tutorial matching connect', () => {
  it('pins connect/face-touching leftovers', () => {
    const byId = Object.fromEntries(sumDominoesTutorial.steps.map((s) => [s.id, s]));
    expect(byId['matching-rules']?.message).toMatch(/connect to an existing/);
    expect(byId['matching-rules']?.message).toMatch(/face touching/);
  });
});
