/**
 * Wave 59 Contig/SD residual — Contig CONFIG win/pass invariants. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG, BOARD_NUMBERS } from '../../src/games/contig-60/types';

describe('Wave 59 contig — CONFIG invariants', () => {
  it('pins grid size, pass elim, alignment, board length', () => {
    expect(CONFIG.GRID_ROWS).toBe(6);
    expect(CONFIG.GRID_COLS).toBe(10);
    expect(CONFIG.MAX_CONSECUTIVE_PASSES).toBe(3);
    expect(CONFIG.WIN_BY_ALIGNMENT).toBe(5);
    expect(BOARD_NUMBERS).toHaveLength(6);
    expect(BOARD_NUMBERS.every((r) => r.length === 10)).toBe(true);
  });
});
