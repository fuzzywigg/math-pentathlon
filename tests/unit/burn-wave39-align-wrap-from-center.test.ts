/**
 * Wave 39 — wrapPosition + findAlignmentFromCenter wrap leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  wrapPosition,
  findAlignmentFromCenter,
  checkMoveForWin,
  checkForWinner,
  DIRECTIONS,
} from '../../src/core/alignment';

describe('Wave 39 align — wrap from center / win checks', () => {
  it('wrapPosition maps negatives', () => {
    expect(wrapPosition(-1, -1, 5, 4)).toEqual({ row: 4, col: 3 });
    expect(wrapPosition(5, 4, 5, 4)).toEqual({ row: 0, col: 0 });
  });

  it('findAlignmentFromCenter with wrap closes toroidal row', () => {
    const board = [
      ['A', null, null, 'A', 'A'],
    ];
    const get = (r: number, c: number) => board[r]?.[c] ?? null;
    const result = findAlignmentFromCenter(0, 0, DIRECTIONS.HORIZONTAL, get, {
      rows: 1,
      cols: 5,
      targetLength: 3,
      wrap: true,
    });
    expect(result).not.toBeNull();
    expect(result!.length).toBe(3);
  });

  it('checkForWinner false on empty', () => {
    const result = checkForWinner(() => null, {
      rows: 3,
      cols: 3,
      targetLength: 3,
    });
    expect(result.hasWinner).toBe(false);
    expect(result.winner).toBeNull();
  });

  it('checkMoveForWin detects completing line', () => {
    const board = [
      ['X', 'X', null],
      [null, null, null],
      [null, null, null],
    ];
    const get = (r: number, c: number) => board[r]?.[c] ?? null;
    const result = checkMoveForWin(0, 2, 'X', get, {
      rows: 3,
      cols: 3,
      targetLength: 3,
      directions: [DIRECTIONS.HORIZONTAL],
    });
    expect(result.hasWinner).toBe(true);
    expect(result.winner).toBe('X');
  });
});
