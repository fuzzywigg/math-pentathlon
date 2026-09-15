/**
 * Wave 66 leftover after tip/#316 — Sum passing cannot-play exact.
 * Soft fewer-pips / both-consec soft-matched; lock cannot-play li. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 66 sum — tutorial passing cannot play', () => {
  it('passing locks cannot play any domino must-pass exact', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'passing');
    expect(step?.message).toContain(
      'If you cannot play any domino, you must pass'
    );
    expect(step?.title).toBe('Passing');
  });
});
