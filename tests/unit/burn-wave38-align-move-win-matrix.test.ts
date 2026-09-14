/**
 * Wave 38 — checkMoveForWin dense placements on near-win boards.
 * Beyond wave 24 grid-alignment-win. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  checkMoveForWin,
  checkForWinner,
  createArrayGetter,
} from '../../src/core/alignment/grid-alignment';
import {
  ALL_DIRECTIONS,
  type AlignmentConfig,
  type CellValue,
} from '../../src/core/alignment/types';

const base: AlignmentConfig = {
  rows: 5,
  cols: 5,
  targetLength: 3,
  directions: ALL_DIRECTIONS,
  wrap: false,
};

describe('Wave 38 align-move — horizontal near-wins', () => {
  it('empty cell completing a row of 3 wins; wrong cell does not', () => {
    const board: CellValue[][] = [
      [null, null, null, null, null],
      ['X', 'X', null, null, null],
      [null, null, null, null, null],
      [null, null, null, null, null],
      [null, null, null, null, null],
    ];
    const get = createArrayGetter(board);
    const win = checkMoveForWin(1, 2, 'X', get, base);
    expect(win.hasWinner).toBe(true);
    expect(win.winner).toBe('X');
    expect(win.alignments.length).toBeGreaterThan(0);

    const miss = checkMoveForWin(1, 4, 'X', get, base);
    expect(miss.hasWinner).toBe(false);

    const foe = checkMoveForWin(1, 2, 'O', get, base);
    expect(foe.hasWinner).toBe(false);
  });
});

describe('Wave 38 align-move — diagonal and vertical completions', () => {
  it('completes diagonal-down and vertical independently', () => {
    const diag: CellValue[][] = [
      ['X', null, null],
      [null, 'X', null],
      [null, null, null],
    ];
    const g1 = createArrayGetter(diag);
    const cfg: AlignmentConfig = { rows: 3, cols: 3, targetLength: 3 };
    expect(checkMoveForWin(2, 2, 'X', g1, cfg).hasWinner).toBe(true);

    const vert: CellValue[][] = [
      [null, 'O', null],
      [null, 'O', null],
      [null, null, null],
    ];
    const g2 = createArrayGetter(vert);
    expect(checkMoveForWin(2, 1, 'O', g2, cfg).hasWinner).toBe(true);
    expect(checkMoveForWin(2, 0, 'O', g2, cfg).hasWinner).toBe(false);
  });
});

describe('Wave 38 align-move — scan all empty cells on almost-full board', () => {
  it('exactly the completing cells report hasWinner', () => {
    const board: CellValue[][] = [
      ['X', 'X', null],
      ['O', 'O', null],
      [null, null, null],
    ];
    const get = createArrayGetter(board);
    const cfg: AlignmentConfig = { rows: 3, cols: 3, targetLength: 3 };
    const xWins: string[] = [];
    const oWins: string[] = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[r][c] != null) continue;
        if (checkMoveForWin(r, c, 'X', get, cfg).hasWinner) xWins.push(`${r},${c}`);
        if (checkMoveForWin(r, c, 'O', get, cfg).hasWinner) oWins.push(`${r},${c}`);
      }
    }
    expect(xWins).toContain('0,2');
    expect(oWins).toContain('1,2');
    // board itself currently has no winner
    expect(checkForWinner(get, cfg).hasWinner).toBe(false);
  });
});
