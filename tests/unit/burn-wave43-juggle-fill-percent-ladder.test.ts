/**
 * Wave 43 — Juggle getBoardFillPercentage ladder leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createBoard } from '../../src/core/polyomino/placement';
import { CONFIG } from '../../src/games/juggle/types';
import { getBoardFillPercentage } from '../../src/games/juggle/rules';

describe('Wave 43 juggle — fill percentage ladder', () => {
  it('empty board is 0%', () => {
    const board = createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
    expect(getBoardFillPercentage(board)).toBe(0);
  });

  it('partial fill rounds', () => {
    const board = createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
    let filled = 0;
    for (let r = 0; r < CONFIG.GRID_SIZE; r++) {
      for (let c = 0; c < CONFIG.GRID_SIZE; c++) {
        if (filled < 40) {
          board.cells[r][c] = true;
          filled++;
        }
      }
    }
    expect(getBoardFillPercentage(board)).toBe(Math.round((40 / 81) * 100));
  });

  it('full board is 100%', () => {
    const board = createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
    for (let r = 0; r < CONFIG.GRID_SIZE; r++) {
      for (let c = 0; c < CONFIG.GRID_SIZE; c++) board.cells[r][c] = true;
    }
    expect(getBoardFillPercentage(board)).toBe(100);
  });
});
