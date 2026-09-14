/**
 * Wave 47 leftover after #214/#215 leftovers D — Hex-a-Gone can place filled. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { canPlaceAt } from '../../src/games/hex-a-gone/rules';

describe('Wave 47 hex-a-gone deepen 11 — hexagone — canPlaceAt filled / OOB / empty', () => {
  it('false on filled and OOB; true on empty', () => {
    const state = createInitialState();
    const cell = state.board[0];
    expect(canPlaceAt(state, cell.q, cell.r)).toBe(true);

    cell.filled = true;
    expect(canPlaceAt(state, cell.q, cell.r)).toBe(false);

    expect(canPlaceAt(state, 99, 99)).toBe(false);
    expect(canPlaceAt(state, -9, 0)).toBe(false);

    const empty = state.board.find((c) => !c.filled)!;
    expect(canPlaceAt(state, empty.q, empty.r)).toBe(true);
  });
});
