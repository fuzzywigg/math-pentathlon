/**
 * Wave 44 — dice totals × poly board fill handshake. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { rollMultiple, getAllPossibleSums } from '../../src/core/dice';
import {
  createBoard,
  placePolyomino,
  countEmptyCells,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 handshake — dice × poly fill', () => {
  it('rolled count can drive monomino placements until empty drops', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const rolled = rollMultiple('d6', 3);
    expect(rolled.total).toBe(3);
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    let board = createBoard(2, 2);
    const startEmpty = countEmptyCells(board);
    board = placePolyomino(board, { ...mono, id: 'a' }, { row: 0, col: 0 });
    board = placePolyomino(board, { ...mono, id: 'b' }, { row: 0, col: 1 });
    board = placePolyomino(board, { ...mono, id: 'c' }, { row: 1, col: 0 });
    expect(countEmptyCells(board)).toBe(startEmpty - 3);
    expect(getAllPossibleSums(rolled.rolls.map((d) => d.value))).toContain(3);
  });
});
