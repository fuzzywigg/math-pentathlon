/**
 * Wave 48 — Juggle getBoardFillPercentage empty vs full leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getBoardFillPercentage } from '../../src/games/juggle/rules';
import { placePolyomino } from '../../src/core/polyomino/placement';
import { SHAPE_POOLS } from '../../src/games/juggle/types';

describe('Wave 48 juggle — fill pct empty/full', () => {
  it('empty board 0%; fully marked board 100%', () => {
    const s = createInitialState();
    expect(getBoardFillPercentage(s.boards.player1)).toBe(0);
    const mono = SHAPE_POOLS.monomino[0];
    let full = s.boards.player1;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        full = placePolyomino(full, mono, { row, col }, 0, false, 1);
      }
    }
    expect(getBoardFillPercentage(full)).toBe(100);
  });
});
