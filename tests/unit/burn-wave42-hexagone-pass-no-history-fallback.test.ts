/**
 * Wave 42 leftovers D — Hex-a-Gone pass no-history fallback. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { passTurn, isGameOver } from '../../src/games/hex-a-gone/rules';

describe('Wave 42 D hexagone — passTurn empty history fallback', () => {
  it('mutual stuck with empty moveHistory awards currentPlayer', () => {
    const state = createInitialState();
    for (const cell of state.board) {
      cell.filled = true;
    }
    expect(state.moveHistory).toHaveLength(0);
    const ended = passTurn(state);
    expect(isGameOver(ended)).toBe(true);
    expect(ended.phase).toBe('gameOver');
    expect(ended.winner).toBe('player1');
  });
});
