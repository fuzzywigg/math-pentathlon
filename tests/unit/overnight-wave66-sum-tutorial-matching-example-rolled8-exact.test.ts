/**
 * Wave 66 leftover after tip/#316 — Sum matching Example rolled-8 exact.
 * Soft so 3+5=8 existed; lock full Example Place faces sentence. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 66 sum — tutorial matching example rolled8', () => {
  it('matching-rules locks Example rolled 8 Place [3|5] exact', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'matching-rules');
    expect(step?.message).toContain(
      'Example: You rolled 8. Place [3|5] next to a [5|2] so 3+5=8'
    );
  });
});
