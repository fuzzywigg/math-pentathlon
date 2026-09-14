/**
 * Wave 43 — Handshake juggle fill% × calla side totals. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState as juggleInit, getBoardFillPercentage } from '../../src/games/juggle/rules';
import {
  createInitialState as callaInit,
  getSideTotalCubes,
  TOTAL_CUBES,
} from '../../src/games/calla/types';

describe('Wave 43 handshake — juggle×calla fill', () => {
  it('opening juggle 0% fill and calla sides sum to TOTAL_CUBES', () => {
    const j = juggleInit();
    expect(getBoardFillPercentage(j.boards.player1)).toBe(0);
    const c = callaInit();
    expect(getSideTotalCubes(c, 'player1') + getSideTotalCubes(c, 'player2')).toBe(TOTAL_CUBES);
  });
});
