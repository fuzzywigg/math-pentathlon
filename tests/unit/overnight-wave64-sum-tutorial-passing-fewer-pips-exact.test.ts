/**
 * Wave 64 leftover after tip/#303 — Sum passing fewer-pips remaining exact.
 * Soft /fewer total pips/ existed; lock full win sentence. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 64 sum — tutorial passing fewer pips exact', () => {
  it('locks fewer total pips on remaining dominoes wins', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'passing');
    expect(step?.message).toContain(
      'Player with fewer total pips on remaining dominoes wins'
    );
  });
});
