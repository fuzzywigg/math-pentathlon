/**
 * Wave 67 leftover after tip/#316 — Sum objective title exact.
 * Soft first-player get-rid copy existed; lock Objective title + center. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 67 sum — tutorial objective title', () => {
  it('objective locks Objective title + first-player fragment', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.title).toBe('Objective');
    expect(step?.position).toBe('center');
    expect(step?.message).toContain(
      'Be the first player to get rid of all your dominoes!'
    );
  });
});
