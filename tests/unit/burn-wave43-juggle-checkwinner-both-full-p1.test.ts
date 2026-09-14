/**
 * Wave 43 — checkWinner both boards filled prefers P1 leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { checkWinner } from '../../src/games/juggle/rules';
import { createBoard } from '../../src/core/polyomino/placement';
import { CONFIG } from '../../src/games/juggle/types';

function filledBoard() {
  const b = createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
  for (let r = 0; r < b.rows; r++) {
    for (let c = 0; c < b.cols; c++) {
      b.cells[r][c] = true;
    }
  }
  return b;
}

describe('Wave 43 juggle — checkWinner both full', () => {
  it('when both filled, player1 wins (checked first)', () => {
    expect(
      checkWinner({ player1: filledBoard(), player2: filledBoard() })
    ).toBe('player1');
  });

  it('only P2 filled → player2', () => {
    expect(
      checkWinner({
        player1: createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE),
        player2: filledBoard(),
      })
    ).toBe('player2');
  });
});
