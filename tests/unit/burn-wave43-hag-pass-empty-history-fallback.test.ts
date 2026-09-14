/**
 * Wave 43 — Hex-a-Gone passTurn empty history winner fallback. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { passTurn } from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hex-a-gone — pass empty history fallback', () => {
  it('mutual stuck with empty history awards currentPlayer', () => {
    const state = createInitialState();
    for (const cell of state.board) cell.filled = true;
    expect(state.moveHistory).toHaveLength(0);
    const next = passTurn(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });
});
