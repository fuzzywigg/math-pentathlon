/**
 * Wave 66 leftover after tip/#316 — Sum matching face-touching exact.
 * Soft connect/face-touching regex existed; lock full sentence. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 66 sum — tutorial matching face touching', () => {
  it('matching-rules locks face touching rolled-sum exact li', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'matching-rules');
    expect(step?.message).toContain(
      'The face touching must create the rolled sum'
    );
    expect(step?.highlightSelector).toBe('.sd-board');
    expect(step?.position).toBe('top');
  });
});
