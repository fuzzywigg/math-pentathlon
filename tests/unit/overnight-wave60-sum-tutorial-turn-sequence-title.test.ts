/**
 * Wave 60 leftover after #282 — Sum turn-sequence title. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 60 sum — tutorial turn-sequence title', () => {
  it('pins Turn Sequence title leftover', () => {
    const byId = Object.fromEntries(sumDominoesTutorial.steps.map((s) => [s.id, s]));
    expect(byId['turn-sequence']?.title).toBe('Turn Sequence');
  });
});
