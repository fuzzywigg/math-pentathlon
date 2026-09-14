/**
 * Wave 43 — Hex-a-Gone board cell count leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, INITIAL_BANK, BLOCK_SIZES } from '../../src/games/hex-a-gone/types';

describe('Wave 43 hag — board cell count', () => {
  it('radius-3 board has 37 cells; bank matches INITIAL_BANK', () => {
    const s = createInitialState();
    expect(s.board).toHaveLength(37);
    expect(s.bank).toEqual(INITIAL_BANK);
    expect(BLOCK_SIZES.hexagon).toBe(6);
    expect(BLOCK_SIZES.triangle).toBe(1);
  });
});
