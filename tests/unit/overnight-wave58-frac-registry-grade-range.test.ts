/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Frac Fact registry gradeRange.
 * Wave57 locked playerCount; deepen Grades 6-7 leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getGameById } from '../../src/core/game-registry';

describe('Wave 58 frac registry — gradeRange', () => {
  it('frac-fact gradeRange Grades 6-7 leftover', () => {
    const game = getGameById('frac-fact');
    expect(game?.gradeRange).toBe('Grades 6-7');
    expect(game?.division).toBe('Division IV');
  });
});
