/**
 * Wave 44 — Contig CONFIG leftovers (rules slice vs #196 AI).
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG, BOARD_NUMBERS } from '../../src/games/contig-60/types';

describe('Wave 44 Contig — CONFIG invariants', () => {
  it('grid dims match BOARD_NUMBERS and win/pass thresholds', () => {
    expect(CONFIG.GRID_ROWS).toBe(BOARD_NUMBERS.length);
    expect(CONFIG.GRID_COLS).toBe(BOARD_NUMBERS[0].length);
    expect(CONFIG.MAX_CONSECUTIVE_PASSES).toBeGreaterThanOrEqual(2);
    expect(CONFIG.WIN_BY_ALIGNMENT).toBe(5);
  });

  it('BOARD_NUMBERS is rectangular 6x10', () => {
    expect(BOARD_NUMBERS.every((row) => row.length === CONFIG.GRID_COLS)).toBe(true);
  });
});
