/**
 * Wave 43 — Handshake ramrod TARGET vs contig MAX_PASSES. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG as R } from '../../src/games/ramrod/types';
import { CONFIG as C } from '../../src/games/contig-60/types';

describe('Wave 43 handshake — ramrod×contig constants', () => {
  it('distinct win thresholds', () => {
    expect(R.TARGET_SCORE).toBe(24);
    expect(C.MAX_CONSECUTIVE_PASSES).toBe(3);
    expect(R.BOARD_ROWS * R.BOARD_COLS).toBe(12);
    expect(C.GRID_ROWS * C.GRID_COLS).toBe(60);
  });
});
