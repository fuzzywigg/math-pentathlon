/**
 * Wave 40 — checkForWinner / checkMoveForWin leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  checkForWinner,
  checkMoveForWin,
  createArrayGetter,
} from '../../src/core/alignment/grid-alignment';
import { DIRECTIONS } from '../../src/core/alignment/types';

describe('Wave 40 align core — winner / move matrix', () => {
  const dirs = [DIRECTIONS.HORIZONTAL, DIRECTIONS.VERTICAL];

  it('no alignment → hasWinner false', () => {
    const board = [
      ['X', null, null],
      [null, 'O', null],
      [null, null, null],
    ];
    const r = checkForWinner(createArrayGetter(board), {
      rows: 3,
      cols: 3,
      targetLength: 3,
      directions: dirs,
    });
    expect(r.hasWinner).toBe(false);
    expect(r.winner).toBeNull();
  });

  it('checkMoveForWin detects completing horizontal three', () => {
    const board = [
      ['X', 'X', null],
      [null, null, null],
      [null, null, null],
    ];
    const r = checkMoveForWin(0, 2, 'X', createArrayGetter(board), {
      rows: 3,
      cols: 3,
      targetLength: 3,
      directions: dirs,
    });
    expect(r.hasWinner).toBe(true);
    expect(r.winner).toBe('X');
  });
});
