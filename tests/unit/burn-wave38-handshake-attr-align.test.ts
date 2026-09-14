/**
 * Wave 38 — handshake: attribute math pieces scored via alignment potential.
 * Existing modules only. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createMathPiece, isPrime } from '../../src/core/attributes/logic';
import {
  countAlignmentPotential,
  checkMoveForWin,
  findAllAlignments,
  createArrayGetter,
} from '../../src/core/alignment/grid-alignment';
import {
  ALL_DIRECTIONS,
  type AlignmentConfig,
  type CellValue,
} from '../../src/core/alignment/types';

describe('Wave 38 handshake — primes on a grid form alignments', () => {
  it('maps 3×3 number grid to P/N tokens; diagonal primes already align', () => {
    const nums = [
      [2, 4, 3],
      [9, 5, 8],
      [1, 15, 7],
    ];
    const board: CellValue[][] = nums.map((row) =>
      row.map((n) => (isPrime(n) ? 'P' : 'N'))
    );
    // diagonal 2,5,7 → P,P,P
    expect(board[0][0]).toBe('P');
    expect(board[1][1]).toBe('P');
    expect(board[2][2]).toBe('P');
    const get = createArrayGetter(board);
    const cfg: AlignmentConfig = {
      rows: 3,
      cols: 3,
      targetLength: 3,
      directions: ALL_DIRECTIONS,
    };
    const all = findAllAlignments(get, cfg);
    expect(all.some((a) => a.value === 'P' && a.length >= 3)).toBe(true);
  });

  it('math piece attributes drive cell tokens; potential counts agree', () => {
    const pieces = [2, 3, 5, 7, 11, 13, 17, 19, 23].map(createMathPiece);
    expect(pieces.every((p) => p.attributes.isPrime === true)).toBe(true);

    const board: CellValue[][] = [
      ['P', 'P', null, null],
      [null, 'P', null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const get = createArrayGetter(board);
    const cfg: AlignmentConfig = {
      rows: 4,
      cols: 4,
      targetLength: 3,
      directions: ALL_DIRECTIONS,
    };
    const map = countAlignmentPotential(0, 1, 'P', get, cfg);
    expect(map.get('horizontal')!.count).toBe(2);
    expect(map.get('vertical')!.count).toBeGreaterThanOrEqual(1);
    expect(checkMoveForWin(0, 2, 'P', get, cfg).hasWinner).toBe(true);
    expect(checkMoveForWin(2, 1, 'P', get, cfg).hasWinner).toBe(true);
  });
});
