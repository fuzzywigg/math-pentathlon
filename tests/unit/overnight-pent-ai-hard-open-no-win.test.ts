/**
 * Overnight HEAVY — Pent hard places without claiming win on sparse inventory.
 * Constrained available set to keep overnight suite light. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIMove } from '../../src/games/pent-em-in/ai';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { placePiece } from '../../src/games/pent-em-in/rules';

afterEach(() => vi.restoreAllMocks());

describe('Overnight pent — hard open no win', () => {
  it('hard place with only X/I5 available keeps phase non-terminal', () => {
    vi.spyOn(Math, 'random').mockReturnValue(1);
    const base = createInitialState();
    const state = {
      ...base,
      player1Pieces: { available: ['X', 'I5'], placed: [] },
    };
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const after = placePiece(
      state,
      move!.shapeId,
      move!.position,
      move!.rotation,
      move!.flipped
    );
    expect(after.winner).toBeNull();
    expect(after.phase).not.toBe('gameOver');
  });
});
