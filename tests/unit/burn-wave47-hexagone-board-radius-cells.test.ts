/**
 * Wave 47 leftover after #214/#215 leftovers D — Hex-a-Gone board radius cells. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';

describe('Wave 47 hex-a-gone deepen 10 — hexagone — board radius / cell layout', () => {
  it('createInitialState board has 37 cells all unfilled', () => {
    const state = createInitialState();
    expect(state.board).toHaveLength(37);
    expect(state.board.every((c) => !c.filled && c.filledBy === null)).toBe(
      true
    );
  });

  it('all cell q,r are in [-3, 3]', () => {
    const state = createInitialState();
    for (const cell of state.board) {
      expect(cell.q).toBeGreaterThanOrEqual(-3);
      expect(cell.q).toBeLessThanOrEqual(3);
      expect(cell.r).toBeGreaterThanOrEqual(-3);
      expect(cell.r).toBeLessThanOrEqual(3);
    }
  });

  it('boardWidth and boardHeight are 7', () => {
    const state = createInitialState();
    expect(state.boardWidth).toBe(7);
    expect(state.boardHeight).toBe(7);
  });
});
