/**
 * Overnight HEAVY — Pent medium top-5 randomness on constrained inventory.
 * Distinct leftover vs wave42 difficulty random. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIMove } from '../../src/games/pent-em-in/ai';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { placePiece } from '../../src/games/pent-em-in/rules';

afterEach(() => vi.restoreAllMocks());

describe('Overnight pent — medium random top5', () => {
  it('medium randomness trigger yields placeable move', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.05)
      .mockReturnValueOnce(0.8);
    const base = createInitialState();
    const state = {
      ...base,
      player1Pieces: { available: ['V', 'U'], placed: [] },
    };
    const move = getAIMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    const after = placePiece(
      state,
      move!.shapeId,
      move!.position,
      move!.rotation,
      move!.flipped
    );
    expect(after.placedPieces.length).toBe(1);
    expect(after.currentPlayer).toBe('player2');
  });
});
