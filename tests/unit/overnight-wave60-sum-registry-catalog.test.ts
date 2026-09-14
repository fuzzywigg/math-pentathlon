/**
 * Wave 60 leftover after #282 — Sum registry catalog fields. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getGameById } from '../../src/core/game-registry';

describe('Wave 60 sum — registry catalog', () => {
  it('locks Division II catalog fields', () => {
    const g = getGameById('sum-dominoes');
    expect(g?.name).toBe('Sum Dominoes & Dice');
    expect(g?.division).toBe('Division II');
    expect(g?.gradeRange).toBe('Grades 2-3');
    expect(g?.description).toBe(
      'Match domino faces to dice sums. Develops subtraction and algebraic thinking.'
    );
    expect(g?.playerCount).toBe('2-4 Players');
    expect(g?.difficulty).toBe('beginner');
    expect(g?.icon).toBe('🁣');
  });
});
