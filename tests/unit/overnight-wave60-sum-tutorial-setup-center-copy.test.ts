/**
 * Wave 60 leftover after #282 — Sum setup center/starting copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 60 sum — tutorial setup center', () => {
  it('pins Setup title and center starting leftovers', () => {
    const byId = Object.fromEntries(sumDominoesTutorial.steps.map((s) => [s.id, s]));
    expect(byId.setup?.title).toBe('Setup');
    expect(byId.setup?.message).toMatch(/starting domino/);
    expect(byId.setup?.message).toMatch(/center of the board/);
  });
});
