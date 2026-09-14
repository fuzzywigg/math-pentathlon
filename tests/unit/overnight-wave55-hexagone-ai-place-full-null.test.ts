/**
 * Wave 55 leftover after #250 — Hex-a-Gone getAIPlacement null on full board. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { selectBlock, commitSelection } from '../../src/games/hex-a-gone/rules';
import { getAIPlacement } from '../../src/games/hex-a-gone/ai';

describe('Wave 55 hexagone — AI full board', () => {
  it('place-phase with every cell filled returns null', () => {
    const placing = commitSelection(selectBlock(createInitialState(), 'triangle'));
    const full = {
      ...placing,
      board: placing.board.map((c) => ({ ...c, filled: true, filledBy: 'player2' as const })),
    };
    expect(getAIPlacement(full, 'player1', 'hard')).toBeNull();
  });
});
