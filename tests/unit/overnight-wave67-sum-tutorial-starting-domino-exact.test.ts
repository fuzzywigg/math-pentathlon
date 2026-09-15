/**
 * Wave 67 leftover after tip/#316 — Sum setup starting-domino exact.
 * Soft starting/center regex + 7-dominoes exact existed; lock full li. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 67 sum — tutorial starting domino exact', () => {
  it('setup locks starting domino center exact li', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'setup');
    expect(step?.message).toContain(
      'A starting domino is placed in the center of the board'
    );
    expect(step?.title).toBe('Setup');
  });
});
