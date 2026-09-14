/**
 * Wave 39 — handshake: dice total sizes poly board after #172/#173.
 * Distinct from wave38 dice→expr. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  rollMultiple,
  selectDice,
  getSelectedTotal,
} from '../../src/core/dice';
import {
  createBoard,
  canPlaceShape,
  countEmptyCells,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

beforeEach(() => {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n = (n + 1) % 97;
    return n / 97;
  });
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 39 handshake — dice → poly size', () => {
  it('selected die total chooses board size then canPlaceShape', () => {
    let result = rollMultiple('d6', 2);
    result = selectDice(
      result,
      result.rolls.map((d) => d.id),
      true
    );
    const n = Math.max(2, Math.min(6, getSelectedTotal(result)));
    const board = createBoard(n, n);
    expect(countEmptyCells(board)).toBe(n * n);
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    expect(canPlaceShape(board, mono)).toBe(true);
  });
});
