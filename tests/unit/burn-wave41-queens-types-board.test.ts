/**
 * Wave 41 — Queens & Guards types board helpers leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  cellKey,
  parseKey,
  cellsInRing,
  getAdjacent,
  isMoveValid,
  createBoard,
  createInitialState,
  CONFIG,
  normalizePosition,
  getOpponent,
} from '../../src/games/queens-guards/types';

describe('Wave 41 Queens — types board', () => {
  it('cellKey / parseKey round-trip', () => {
    expect(cellKey(3, 11)).toBe('3-11');
    expect(parseKey('3-11')).toEqual({ ring: 3, position: 11 });
    expect(parseKey(cellKey(0, 0))).toEqual({ ring: 0, position: 0 });
  });

  it('cellsInRing sizes match hex rings', () => {
    expect(cellsInRing(0)).toBe(1);
    expect(cellsInRing(1)).toBe(6);
    expect(cellsInRing(5)).toBe(30);
    expect(cellsInRing(CONFIG.NUM_RINGS - 1)).toBe(6 * (CONFIG.NUM_RINGS - 1));
  });

  it('getAdjacent from center yields all ring-1 cells', () => {
    const adj = getAdjacent({ ring: 0, position: 0 });
    expect(adj).toHaveLength(6);
    expect(adj.every((a) => a.ring === 1)).toBe(true);
  });

  it('getAdjacent same-ring neighbors wrap via normalizePosition', () => {
    const adj = getAdjacent({ ring: 2, position: 0 });
    expect(adj.some((a) => a.ring === 2 && a.position === 1)).toBe(true);
    expect(
      adj.some(
        (a) => a.ring === 2 && a.position === normalizePosition(2, -1)
      )
    ).toBe(true);
  });

  it('isMoveValid allows sideways and inward, rejects outward', () => {
    expect(isMoveValid({ ring: 3, position: 0 }, { ring: 3, position: 1 })).toBe(
      true
    );
    expect(isMoveValid({ ring: 3, position: 0 }, { ring: 2, position: 0 })).toBe(
      true
    );
    expect(isMoveValid({ ring: 3, position: 0 }, { ring: 4, position: 0 })).toBe(
      false
    );
  });

  it('createBoard places queens and guards on outer ring', () => {
    const board = createBoard();
    const outer = CONFIG.NUM_RINGS - 1;
    let expectedCells = 1;
    for (let r = 1; r < CONFIG.NUM_RINGS; r++) expectedCells += 6 * r;
    expect(board.size).toBe(expectedCells);
    expect(board.get(cellKey(outer, 7))?.piece?.type).toBe('queen');
    expect(board.get(cellKey(outer, 22))?.piece?.type).toBe('queen');
    let guards = 0;
    for (const cell of board.values()) {
      if (cell.piece?.type === 'guard') guards++;
    }
    expect(guards).toBe(CONFIG.GUARDS_PER_PLAYER * 2);
    expect(getOpponent('player1')).toBe('player2');
    expect(createInitialState().cells.size).toBe(board.size);
  });
});
