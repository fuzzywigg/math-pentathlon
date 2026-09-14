/**
 * Wave 56 leftover after #243 — Sum Dominoes tutorial passing/strategy residual.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 56 sum — tutorial passing strategy', () => {
  it('keeps consecutive-pass and 7-most-common copy', () => {
    const byId = Object.fromEntries(sumDominoesTutorial.steps.map((s) => [s.id, s]));
    expect(byId['passing']?.message).toMatch(/pass consecutively/);
    expect(byId['passing']?.message).toMatch(/fewer total pips/);
    expect(byId['strategy-tips']?.message).toContain('7 is the most common');
  });
});
