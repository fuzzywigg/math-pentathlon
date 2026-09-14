/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball registry catalog leftover.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getGameById } from '../../src/core/game-registry';

describe('Wave 56 pinball registry — catalog', () => {
  it('Fraction Pinball Division IV description/icon leftover', () => {
    const g = getGameById('fraction-pinball');
    expect(g?.name).toBe('Fraction Pinball');
    expect(g?.division).toBe('Division IV');
    expect(g?.gradeRange).toBe('Grades 6-7');
    expect(g?.description).toBe(
      'Fraction-decimal conversion game simulating pinball mechanics.'
    );
    expect(g?.icon).toBe('🎰');
    expect(g?.available).toBe(true);
    expect(g?.playerCount).toBe('2 Players');
  });
});
