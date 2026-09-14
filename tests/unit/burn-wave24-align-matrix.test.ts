/**
 * Wave 24 — integration matrices across grid-alignment APIs.
 * Cross-checks createArrayGetter boards through scan / center / potential /
 * move-win for existing N-in-a-row contracts. Distinct from per-API files.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createArrayGetter,
  findAlignmentInDirection,
  findAlignmentsForValue,
  findAllAlignments,
  checkForWinner,
  findAlignmentFromCenter,
  checkMoveForWin,
  countAlignmentPotential,
  isInBounds,
  wrapPosition,
} from '../../src/core/alignment/grid-alignment';
import {
  DIRECTIONS,
  ALL_DIRECTIONS,
  type AlignmentConfig,
  type CellValue,
} from '../../src/core/alignment/types';

function ticTacToeWinBoard(): CellValue[][] {
  return [
    ['X', 'O', 'X'],
    ['O', 'X', 'O'],
    [null, 'O', 'X'],
  ];
}

describe('Wave 24 align-matrix — tic-tac-toe diagonal consistency', () => {
  it('direction / center / value-scan / winner all agree on X diagonal', () => {
    const board = ticTacToeWinBoard();
    const get = createArrayGetter(board);
    const config: AlignmentConfig = {
      rows: 3,
      cols: 3,
      targetLength: 3,
    };

    const fromCorner = findAlignmentInDirection(
      0,
      0,
      DIRECTIONS.DIAGONAL_DOWN,
      get,
      config
    );
    expect(fromCorner?.value).toBe('X');
    expect(fromCorner?.length).toBe(3);

    const fromCenter = findAlignmentFromCenter(
      1,
      1,
      DIRECTIONS.DIAGONAL_DOWN,
      get,
      config
    );
    expect(fromCenter?.value).toBe('X');
    expect(fromCenter?.length).toBe(3);

    const forX = findAlignmentsForValue('X', get, config);
    expect(forX.some((a) => a.direction.name === 'diagonal-down')).toBe(true);

    const winner = checkForWinner(get, config);
    expect(winner.hasWinner).toBe(true);
    expect(winner.winner).toBe('X');
  });

  it('empty corner move would not create a second X win on same board', () => {
    const board = ticTacToeWinBoard();
    const get = createArrayGetter(board);
    const config: AlignmentConfig = {
      rows: 3,
      cols: 3,
      targetLength: 3,
    };
    // (2,0) is empty — placing O there does not win for O
    const oMove = checkMoveForWin(2, 0, 'O', get, config);
    expect(oMove.hasWinner).toBe(false);
  });
});

describe('Wave 24 align-matrix — connect-four column drop simulation', () => {
  it('building a column via checkMoveForWin then applying agrees with scan', () => {
    const board: CellValue[][] = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const config: AlignmentConfig = {
      rows: 6,
      cols: 4,
      targetLength: 4,
      directions: [DIRECTIONS.VERTICAL, DIRECTIONS.HORIZONTAL],
    };

    // Drop four O's in column 1 from bottom
    const drops = [
      { r: 5, c: 1 },
      { r: 4, c: 1 },
      { r: 3, c: 1 },
      { r: 2, c: 1 },
    ];
    for (let i = 0; i < drops.length; i++) {
      const { r, c } = drops[i];
      const get = createArrayGetter(board);
      const before = checkMoveForWin(r, c, 'O', get, config);
      if (i < 3) {
        expect(before.hasWinner).toBe(false);
      } else {
        expect(before.hasWinner).toBe(true);
        expect(before.winner).toBe('O');
      }
      board[r][c] = 'O';
    }

    const finalGet = createArrayGetter(board);
    expect(checkForWinner(finalGet, config).winner).toBe('O');
    expect(
      findAlignmentsForValue('O', finalGet, config).some(
        (a) => a.direction.name === 'vertical'
      )
    ).toBe(true);
  });
});

describe('Wave 24 align-matrix — potential correlates with open lines', () => {
  it('higher horizontal count when more friends share the row', () => {
    const thin: CellValue[][] = [
      [null, null, null, null, null],
      [null, null, 'X', null, null],
      [null, null, null, null, null],
    ];
    const thick: CellValue[][] = [
      [null, null, null, null, null],
      [null, 'X', 'X', 'X', null],
      [null, null, null, null, null],
    ];
    const cfg: AlignmentConfig = {
      rows: 3,
      cols: 5,
      targetLength: 3,
      directions: [DIRECTIONS.HORIZONTAL],
    };
    const a = countAlignmentPotential(1, 2, 'X', createArrayGetter(thin), cfg);
    const b = countAlignmentPotential(1, 2, 'X', createArrayGetter(thick), cfg);
    expect(b.get('horizontal')!.count).toBeGreaterThan(
      a.get('horizontal')!.count
    );
    expect(a.get('horizontal')!.blocked).toBe(false);
    expect(b.get('horizontal')!.blocked).toBe(false);
  });
});

describe('Wave 24 align-matrix — bounds helpers used by wrap scans', () => {
  it('wrapPosition always yields in-bounds coords for positive sizes', () => {
    const rows = 4;
    const cols = 6;
    for (const row of [-3, -1, 0, 3, 4, 10, 100]) {
      for (const col of [-2, 0, 5, 6, 17]) {
        const w = wrapPosition(row, col, rows, cols);
        expect(isInBounds(w.row, w.col, rows, cols)).toBe(true);
      }
    }
  });

  it('ALL_DIRECTIONS has unique names matching DIRECTIONS values', () => {
    const names = ALL_DIRECTIONS.map((d) => d.name);
    expect(new Set(names).size).toBe(names.length);
    expect(names).toEqual(Object.values(DIRECTIONS).map((d) => d.name));
  });
});

describe('Wave 24 align-matrix — multi-winner board reports all alignments', () => {
  it('findAllAlignments can return multiple when two lines complete', () => {
    // Full X row and full X col through corner — two distinct alignments
    const board: CellValue[][] = [
      ['X', 'X', 'X'],
      ['X', null, null],
      ['X', null, null],
    ];
    const get = createArrayGetter(board);
    const config: AlignmentConfig = {
      rows: 3,
      cols: 3,
      targetLength: 3,
      directions: [DIRECTIONS.HORIZONTAL, DIRECTIONS.VERTICAL],
    };
    const all = findAllAlignments(get, config);
    expect(all.length).toBeGreaterThanOrEqual(2);
    const winner = checkForWinner(get, config);
    expect(winner.hasWinner).toBe(true);
    expect(winner.alignments.length).toBe(all.length);
  });
});
