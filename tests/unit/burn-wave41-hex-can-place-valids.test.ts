/**
 * Wave 41 — Hex-a-Gone canPlaceAt + getValidPlacements dense matrix.
 * Missing coords / filled / no-selection. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  canPlaceAt,
  getValidPlacements,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 41 hex-a-gone — canPlaceAt / valids', () => {
  it('getValidPlacements empty without selectedBlockForPlacement', () => {
    expect(getValidPlacements(createInitialState())).toEqual([]);
  });

  it('canPlaceAt false for missing / filled; true for empty board cell', () => {
    const state = createInitialState();
    expect(canPlaceAt(state, 999, 999)).toBe(false);
    expect(canPlaceAt(state, -99, 50)).toBe(false);
    const cell = state.board[0];
    expect(canPlaceAt(state, cell.q, cell.r)).toBe(true);
    cell.filled = true;
    expect(canPlaceAt(state, cell.q, cell.r)).toBe(false);
  });

  it('getValidPlacements lists all empty cells after commit', () => {
    let state = commitSelection(selectBlock(createInitialState(), 'square'));
    const all = getValidPlacements(state);
    expect(all.length).toBe(state.board.filter((c) => !c.filled).length);
    expect(all.length).toBe(state.board.length);

    // Fill one
    const target = all[0];
    state = {
      ...state,
      board: state.board.map((c) =>
        c.q === target.q && c.r === target.r
          ? { ...c, filled: true, filledBy: 'player1' as const, blockId: 1 }
          : c
      ),
    };
    const remaining = getValidPlacements(state);
    expect(remaining).toHaveLength(all.length - 1);
    expect(
      remaining.some((p) => p.q === target.q && p.r === target.r)
    ).toBe(false);
  });

  it('canPlaceAt matrix over a ring of known coords', () => {
    const state = createInitialState();
    const samples = [
      { q: 0, r: 0, ok: true },
      { q: 3, r: 0, ok: true },
      { q: -3, r: 0, ok: true },
      { q: 4, r: 0, ok: false },
      { q: 0, r: 4, ok: false },
    ];
    for (const s of samples) {
      expect(canPlaceAt(state, s.q, s.r)).toBe(s.ok);
    }
  });
});
