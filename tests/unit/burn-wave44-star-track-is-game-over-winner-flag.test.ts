/**
 * Wave 44 — Star Track isGameOver winner-flag leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { isGameOver } from '../../src/games/star-track/rules';

describe('Wave 44 Star Track — isGameOver winner flag', () => {
  it('true when winner set even if phase lagged', () => {
    const s = { ...createInitialState(), winner: 'player2' as const };
    expect(isGameOver(s)).toBe(true);
  });
});
