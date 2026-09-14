/**
 * Overnight TOKENMAXX — Calla animating AI null leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getValidPits, canSelectPit } from '../../src/games/calla/rules';
import { getAIMove } from '../../src/games/calla/ai';

describe('Overnight calla — animating nulls', () => {
  it('animating yields empty valids and null AI', () => {
    const s = { ...createInitialState(), phase: 'animating' as const };
    expect(getValidPits(s)).toEqual([]);
    expect(canSelectPit(s, 'player1', 0)).toBe(false);
    expect(getAIMove(s, 'player1', 'easy')).toBeNull();
  });
});
