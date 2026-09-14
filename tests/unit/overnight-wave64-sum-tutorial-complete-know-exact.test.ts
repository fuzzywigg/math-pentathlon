/**
 * Wave 64 leftover after tip/#303 — Sum complete Now-you-know exact.
 * Contig know-copy existed; Sum complete know was unsaturated. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 64 sum — tutorial complete know exact', () => {
  it('locks Now you know Sum Dominoes & Dice fragment', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain(
      'Now you know how to play Sum Dominoes & Dice!'
    );
    expect(step?.title).toBe('Ready to Play!');
  });
});
