/**
 * Wave 43 — Hex-a-Gone board size + bank inventory leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  INITIAL_BANK,
  BLOCK_SIZES,
  getAvailableShapes,
  isValidPosition,
  getCellAt,
} from '../../src/games/hex-a-gone/types';

describe('Wave 43 hex-a-gone — board/bank invariants', () => {
  it('radius-3 hex board has 37 cells; center exists', () => {
    const state = createInitialState();
    expect(state.board).toHaveLength(37);
    expect(getCellAt(state, 0, 0)).toBeDefined();
    expect(isValidPosition(state, 0, 0)).toBe(true);
    expect(isValidPosition(state, 99, 99)).toBe(false);
  });

  it('bank matches INITIAL_BANK; all shapes available at open', () => {
    const state = createInitialState();
    expect(state.bank).toEqual(INITIAL_BANK);
    expect(getAvailableShapes(state).sort()).toEqual(
      (['hexagon', 'trapezoid', 'rhombus', 'triangle', 'square'] as const).slice().sort()
    );
    expect(BLOCK_SIZES.hexagon).toBe(6);
    expect(BLOCK_SIZES.triangle).toBe(1);
  });
});
