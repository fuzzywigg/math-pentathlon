/**
 * Overnight HEAVY leftover after #256 — createBoardWithBlockedCells([],) ≡ createBoard.
 * Distinct from wave53 OOB blocked ignore. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createBoard,
  createBoardWithBlockedCells,
  countEmptyCells,
} from '../../src/core/polyomino';

describe('Wave 56 core poly — blocked empty identity', () => {
  it('empty blocked list matches plain createBoard occupancy', () => {
    const plain = createBoard(3, 3);
    const blocked = createBoardWithBlockedCells(3, 3, []);
    expect(blocked.rows).toBe(plain.rows);
    expect(blocked.cols).toBe(plain.cols);
    expect(countEmptyCells(blocked)).toBe(countEmptyCells(plain));
    expect(blocked.cells.flat().every((c) => c === false)).toBe(true);
    expect(blocked.placements).toEqual([]);
  });
});
