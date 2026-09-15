/**
 * Wave 67 leftover after tip/#316 — Sum passing fewer-pips exact.
 * Soft /fewer total pips/ existed; lock full win sentence + center. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 67 sum — tutorial fewer pips exact', () => {
  it('passing locks fewer total pips wins exact sentence', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'passing');
    expect(step?.message).toContain(
      'Player with fewer total pips on remaining dominoes wins'
    );
    expect(step?.position).toBe('center');
  });
});
