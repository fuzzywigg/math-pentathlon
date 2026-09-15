/**
 * Wave 67 leftover after tip/#316 — Sum complete know-exact.
 * Soft Finish clear existed; lock Now you know Sum Dominoes paragraph. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 67 sum — tutorial complete know exact', () => {
  it('complete locks Now you know Sum Dominoes exact', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain(
      'Now you know how to play Sum Dominoes & Dice!'
    );
    expect(step?.title).toBe('Ready to Play!');
  });
});
