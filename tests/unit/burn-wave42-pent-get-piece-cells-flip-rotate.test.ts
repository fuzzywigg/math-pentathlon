/**
 * Wave 42 — Pent'Em In getPieceCells flip-then-rotate for flippable shapes leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPieceCells } from '../../src/games/pent-em-in/rules';
import {
  flipCellsHorizontal as flipCells,
  rotateCells,
} from '../../src/core/polyomino/transform';
import { getPentominoShape } from '../../src/games/pent-em-in/types';

describe('Wave 42 pent-em-in — getPieceCells flip then rotate', () => {
  it('F shape: flipped+rotated matches manual flip-then-rotate pipeline', () => {
    const shape = getPentominoShape('F')!;
    const pos = { row: 3, col: 4 };
    let manual = [...shape.cells];
    manual = flipCells(manual);
    manual = rotateCells(manual, 90);
    const expected = manual.map((c) => ({
      row: pos.row + c.row,
      col: pos.col + c.col,
    }));
    expect(getPieceCells('F', pos, 90, true)).toEqual(expected);
  });

  it('flip then rotate differs from rotate-only for F at same anchor', () => {
    const pos = { row: 2, col: 2 };
    const rotatedOnly = getPieceCells('F', pos, 90, false);
    const flippedAndRotated = getPieceCells('F', pos, 90, true);
    expect(flippedAndRotated).not.toEqual(rotatedOnly);
  });

  it('flip flag ignored when shape.canFlip is false (I5)', () => {
    const pos = { row: 1, col: 1 };
    expect(getPieceCells('I5', pos, 0, false)).toEqual(
      getPieceCells('I5', pos, 0, true)
    );
  });
});
