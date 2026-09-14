/**
 * Wave 43 — Juggle preview/valid/place on empty board. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  getPreviewCells,
  isPlacementValid,
  placeShape,
  getBoardFillPercentage,
} from '../../src/games/juggle/rules';
import { SHAPE_POOLS } from '../../src/games/juggle/types';

describe('Wave 43 juggle — preview valid place', () => {
  const mono = SHAPE_POOLS.monomino[0];

  function placingMono() {
    return {
      ...createInitialState(),
      phase: 'placing' as const,
      currentDice: [1, 1] as [number, number],
      selectedCategory: 'monomino' as const,
      selectedShape: mono,
    };
  }

  it('preview empty without selected shape; monomino previews one cell', () => {
    expect(getPreviewCells(createInitialState(), { row: 0, col: 0 })).toEqual([]);
    const cells = getPreviewCells(placingMono(), { row: 2, col: 3 });
    expect(cells).toHaveLength(1);
    expect(cells[0]).toEqual({ row: 2, col: 3 });
  });

  it('isPlacementValid false off-phase; true for in-bounds mono', () => {
    expect(isPlacementValid(createInitialState(), { row: 0, col: 0 })).toBe(false);
    expect(isPlacementValid(placingMono(), { row: 0, col: 0 })).toBe(true);
    expect(isPlacementValid(placingMono(), { row: 99, col: 99 })).toBe(false);
  });

  it('placeShape fills cell, records move, returns to rolling for opponent', () => {
    const next = placeShape(placingMono(), { row: 0, col: 0 });
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory).toHaveLength(1);
    expect(next.moveHistory[0].shapeId).toBe(mono.id);
    expect(getBoardFillPercentage(next.boards.player1)).toBeGreaterThan(0);
    expect(next.selectedShape).toBeNull();
    expect(next.currentDice).toBeNull();
  });

  it('placeShape identity on invalid / wrong phase', () => {
    const s = placingMono();
    expect(placeShape(s, { row: -1, col: 0 })).toBe(s);
    const rolling = createInitialState();
    expect(placeShape(rolling, { row: 0, col: 0 })).toBe(rolling);
  });
});
