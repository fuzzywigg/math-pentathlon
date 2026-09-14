/**
 * Wave 64 leftover after tip/#303 — Sum objective first-player exact.
 * Soft get-rid existed; lock Be the first player sentence. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 64 sum — tutorial objective first player', () => {
  it('locks Be the first player objective fragment', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.title).toBe('Objective');
    expect(step?.message).toContain(
      'Be the first player to get rid of all your dominoes!'
    );
    expect(step?.position).toBe('center');
  });
});
