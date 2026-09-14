/**
 * Wave 42 leftovers B — Hex getValidMoves empty after full board fill.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/hex/types';
import { makeMove, getValidMoves, isValidMove } from '../../src/games/hex/rules';
import { getRandomMove } from '../../src/games/hex/ai';

describe('Wave 42 hex — fill board valids empty', () => {
  it('fills 3x3 without early win → no moves left', () => {
    let state = createInitialState(3);
    // Checkerboard that may or may not win early; drain empties
    const coords: { row: number; col: number }[] = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) coords.push({ row: r, col: c });
    }
    for (const pos of coords) {
      if (state.winner) break;
      if (isValidMove(state, pos)) {
        state = makeMove(state, pos);
      }
    }
    if (!state.winner) {
      expect(getValidMoves(state)).toEqual([]);
      expect(getRandomMove(state)).toBeNull();
    } else {
      expect(getValidMoves(state)).toEqual([]);
    }
  });
});
