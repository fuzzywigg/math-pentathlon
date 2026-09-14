/**
 * Wave 43 — Juggle checkWinner prefers player1 when both filled. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createBoard } from '../../src/core/polyomino/placement';
import { CONFIG } from '../../src/games/juggle/types';
import { checkWinner } from '../../src/games/juggle/rules';

function fill(board = createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE)) {
  for (let r = 0; r < CONFIG.GRID_SIZE; r++) {
    for (let c = 0; c < CONFIG.GRID_SIZE; c++) board.cells[r][c] = true;
  }
  return board;
}

describe('Wave 43 juggle — both boards filled', () => {
  it('player1 wins when both boards are filled', () => {
    expect(checkWinner({ player1: fill(), player2: fill() })).toBe('player1');
  });

  it('player2 wins only when player1 empty and player2 full', () => {
    expect(
      checkWinner({
        player1: createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE),
        player2: fill(),
      })
    ).toBe('player2');
  });
});
