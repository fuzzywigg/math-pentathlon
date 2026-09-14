/**
 * Wave 57 leftover after #267 — Sum strategy-tips tutorial copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 57 sum — tutorial strategy tips', () => {
  it('pins Strategy Tips title and common sum 7', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.title).toBe('Strategy Tips');
    expect(step?.message).toMatch(/7 is the most common dice sum/);
  });
});
