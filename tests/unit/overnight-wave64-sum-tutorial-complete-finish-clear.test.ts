/**
 * Wave 64 leftover after tip/#303 — Sum complete Finish clear-hand exact.
 * Soft /clear your hand/ existed; lock strong HTML. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 64 sum — tutorial complete finish clear', () => {
  it('locks Finish strong + clear your hand fragment', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain(
      'Click <strong>Finish</strong> and clear your hand!'
    );
    expect(step?.position).toBe('center');
  });
});
