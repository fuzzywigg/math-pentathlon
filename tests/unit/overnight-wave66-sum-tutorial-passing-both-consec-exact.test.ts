/**
 * Wave 66 leftover after tip/#316 — Sum passing both-consec exact.
 * Soft both-consec regex existed; lock full ends sentence. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 66 sum — tutorial passing both consec', () => {
  it('passing locks both players pass consecutively ends exact', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'passing');
    expect(step?.message).toContain(
      'If both players pass consecutively, the game ends'
    );
  });
});
