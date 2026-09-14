/**
 * Wave 45 — Pent AI opening hard leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { getAIMove, isAITurn } from '../../src/games/pent-em-in/ai';

describe('Wave 45 pent — AI opening', () => {
  afterEach(() => vi.restoreAllMocks());

  it('hard returns a placeable shape at opening', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(state.player1Pieces.available).toContain(move!.shapeId);
  });

  it('isAITurn false when null/gameOver', () => {
    const state = createInitialState();
    expect(isAITurn(state, null)).toBe(false);
    expect(isAITurn({ ...state, phase: 'gameOver' }, 'player1')).toBe(false);
    expect(isAITurn(state, 'player1')).toBe(true);
  });
});
