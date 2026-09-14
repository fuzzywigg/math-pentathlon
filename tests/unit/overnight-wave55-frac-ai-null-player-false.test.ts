/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact isAITurn null player.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { isAITurn } from '../../src/games/frac-fact/ai';
import { createInitialState } from '../../src/games/frac-fact/types';
import { startGame } from '../../src/games/frac-fact/rules';

describe('Wave 55 frac AI — null player', () => {
  it('isAITurn false when aiPlayer is null even while playing', () => {
    const state = startGame(createInitialState('medium'));
    expect(isAITurn(state, null)).toBe(false);
  });
});
