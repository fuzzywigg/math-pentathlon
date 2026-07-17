import { describe, it, expect } from 'vitest';
import { BOARD_NUMBERS, createBoard, CONFIG } from '../../src/games/contig-60/types';

describe('Contig 60 Board', () => {
  it('has exactly 60 cells (6x10)', () => {
    const flat = BOARD_NUMBERS.flat();
    expect(flat.length).toBe(CONFIG.GRID_ROWS * CONFIG.GRID_COLS);
  });

  it('BOARD_NUMBERS contains no duplicates', () => {
    const flat = BOARD_NUMBERS.flat();
    const unique = new Set(flat);
    expect(unique.size).toBe(flat.length);
  });

  it('createBoard throws on duplicate numbers', () => {
    const duplicateBoard = BOARD_NUMBERS.map((row) => [...row]);
    duplicateBoard[5][9] = duplicateBoard[0][0];

    expect(() => createBoard(duplicateBoard)).toThrow('Duplicate board number: 1');
  });

  it('createBoard returns a cells map with 60 unique entries', () => {
    const { cells } = createBoard();
    expect(cells.size).toBe(60);
  });

  it('createBoard grid dimensions match CONFIG', () => {
    const { grid } = createBoard();
    expect(grid.length).toBe(CONFIG.GRID_ROWS);
    grid.forEach((row) => expect(row.length).toBe(CONFIG.GRID_COLS));
  });
});
