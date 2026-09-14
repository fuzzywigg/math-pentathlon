/**
 * Wave 64 leftover after tip/#303 — Sum strategy 7-most-common + title.
 * Soft /7 is the most common/ existed; lock title + tip trio. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 64 sum — tutorial strategy seven common', () => {
  it('locks Strategy Tips title and 7 most common leftover', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.title).toBe('Strategy Tips');
    expect(step?.message).toContain('7 is the most common dice sum');
    expect(step?.message).toContain(
      'Watch which sums are likely based on dice probabilities'
    );
  });
});
