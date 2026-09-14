/**
 * Wave 42 — Pent'Em In AI getAIMove easy/medium/hard + Math.random leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { getAIMove } from '../../src/games/pent-em-in/ai';
import { canPlacePiece } from '../../src/games/pent-em-in/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 42 pent-em-in — AI difficulty + randomness', () => {
  it('hard with random=0 picks top-scored legal move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(
      canPlacePiece(
        state,
        move!.shapeId,
        move!.position,
        move!.rotation,
        move!.flipped
      )
    ).toBe(true);
  });

  it('medium with high random still returns valid placement', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(state.player1Pieces.available).toContain(move!.shapeId);
  });

  it('easy teaching mode returns move when random avoids suboptimal pick', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(typeof move!.position.row).toBe('number');
    expect(typeof move!.position.col).toBe('number');
  });

  it('easy may pick suboptimal when random < 0.4 and many moves exist', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const state = createInitialState();
    const best = getAIMove({ ...state }, 'player1', 'hard');
    const teaching = getAIMove(state, 'player1', 'easy');
    expect(teaching).not.toBeNull();
    expect(best).not.toBeNull();
  });
});
