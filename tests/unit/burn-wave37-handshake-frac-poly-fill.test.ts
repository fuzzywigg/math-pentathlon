/**
 * Wave 37 — handshake: polyomino fill ratios via fraction arithmetic.
 * Cross-slice, still tests-only against existing APIs. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createBoard,
  placePolyomino,
  countEmptyCells,
  TETROMINOES,
  SIMPLE_SHAPES,
  createHexagonalBoard,
} from '../../src/core/polyomino';
import {
  createFraction,
  areEqual,
  add,
  subtract,
  toDecimal,
  simplify,
  compare,
  fromWhole,
} from '../../src/core/fractions';

function fillRatio(empty: number, total: number) {
  return createFraction(total - empty, total);
}

describe('Wave 37 handshake — poly fill as fraction', () => {
  it('empty board fill is 0; full monomino board is 1', () => {
    const board = createBoard(2, 2);
    expect(areEqual(fillRatio(countEmptyCells(board), 4), fromWhole(0))).toBe(
      true
    );
    let filled = board;
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        filled = placePolyomino(filled, { ...mono, id: `m${r}${c}` }, {
          row: r,
          col: c,
        });
      }
    }
    expect(areEqual(fillRatio(countEmptyCells(filled), 4), fromWhole(1))).toBe(
      true
    );
  });

  it('each O placement adds exactly 4/n to fill on n-cell board', () => {
    const O = TETROMINOES.find((s) => s.id === 'O')!;
    const total = 16;
    let board = createBoard(4, 4);
    let ratio = fromWhole(0);
    const step = createFraction(4, total);
    for (const pos of [
      { row: 0, col: 0 },
      { row: 0, col: 2 },
      { row: 2, col: 0 },
      { row: 2, col: 2 },
    ]) {
      board = placePolyomino(board, { ...O, id: `O${pos.row}${pos.col}` }, pos);
      ratio = add(ratio, step);
      expect(
        areEqual(simplify(fillRatio(countEmptyCells(board), total)), simplify(ratio))
      ).toBe(true);
    }
    expect(areEqual(ratio, fromWhole(1))).toBe(true);
  });

  it('hex board radius-1 fill after center monomino is 1/7', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    let board = createHexagonalBoard(1);
    const total = countEmptyCells(board);
    expect(total).toBe(7);
    board = placePolyomino(board, mono, { row: 1, col: 1 });
    expect(
      areEqual(fillRatio(countEmptyCells(board), total), createFraction(1, 7))
    ).toBe(true);
  });

  it('remaining fraction equals 1 − fill', () => {
    const O = TETROMINOES.find((s) => s.id === 'O')!;
    const board = placePolyomino(createBoard(5, 5), O, { row: 0, col: 0 });
    const total = 25;
    const filled = fillRatio(countEmptyCells(board), total);
    const remain = createFraction(countEmptyCells(board), total);
    expect(areEqual(add(filled, remain), fromWhole(1))).toBe(true);
    expect(areEqual(subtract(fromWhole(1), filled), remain)).toBe(true);
    expect(compare(filled, remain)).toBe(-1);
    expect(toDecimal(filled)).toBeCloseTo(4 / 25, 10);
  });
});
