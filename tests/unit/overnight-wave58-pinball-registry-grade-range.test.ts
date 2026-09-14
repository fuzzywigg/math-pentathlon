/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Pinball registry gradeRange.
 * Wave57 locked difficulty; deepen Grades 6-7 leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getGameById } from '../../src/core/game-registry';

describe('Wave 58 pinball registry — gradeRange', () => {
  it('fraction-pinball gradeRange Grades 6-7 leftover', () => {
    const game = getGameById('fraction-pinball');
    expect(game?.gradeRange).toBe('Grades 6-7');
    expect(game?.division).toBe('Division IV');
  });
});
