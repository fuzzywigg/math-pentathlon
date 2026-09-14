/**
 * Wave 46 — Pent placePiece occupies five cells leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { placePiece, getPieceCells } from '../../src/games/pent-em-in/rules';

describe('Wave 46 pent — occupy cells', () => {
  it('X place marks five board cells occupied by player1', () => {
    const state = createInitialState();
    const pos = { row: 4, col: 4 };
    const cells = getPieceCells('X', pos, 0, false);
    const next = placePiece(state, 'X', pos, 0, false);
    expect(cells).toHaveLength(5);
    for (const c of cells) {
      expect(next.board[c.row][c.col].occupied).toBe(true);
      expect(next.board[c.row][c.col].owner).toBe('player1');
    }
  });
});
