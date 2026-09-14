/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball isAITurn null player leftover.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { isAITurn } from '../../src/games/fraction-pinball/ai';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { startGame } from '../../src/games/fraction-pinball/rules';

describe('Wave 55 pinball AI — null player', () => {
  it('isAITurn false when aiPlayer is null leftover', () => {
    expect(isAITurn(startGame(createInitialState()), null)).toBe(false);
  });
});
