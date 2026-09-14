/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact registry catalog leftover.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getGameById } from '../../src/core/game-registry';

describe('Wave 56 frac registry — catalog', () => {
  it('Frac Fact Division IV description/icon leftover', () => {
    const g = getGameById('frac-fact');
    expect(g?.name).toBe('Frac Fact');
    expect(g?.division).toBe('Division IV');
    expect(g?.gradeRange).toBe('Grades 6-7');
    expect(g?.description).toBe(
      'Combine fraction bars with operations to match answer bars.'
    );
    expect(g?.icon).toBe('⅔');
    expect(g?.available).toBe(true);
    expect(g?.difficulty).toBe('intermediate');
  });
});
