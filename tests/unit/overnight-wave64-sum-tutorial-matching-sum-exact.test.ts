/**
 * Wave 64 leftover after tip/#303 — Sum matching 3+5=8 exact.
 * Soft /You rolled 8/ [3|5] existed; lock sum equation. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 64 sum — tutorial matching sum exact', () => {
  it('locks 3+5=8 example equation leftover', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'matching-rules');
    expect(step?.message).toContain('so 3+5=8');
    expect(step?.message).toContain(
      'Place [3|5] next to a [5|2] so 3+5=8'
    );
  });
});
