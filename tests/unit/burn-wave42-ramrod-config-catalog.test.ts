/**
 * Wave 42 leftovers D — ramrod config catalog. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG } from '../../src/games/ramrod/types';

describe('Wave 42 ramrod — config catalog', () => {
  it('CONFIG TARGET_SCORE 24, BOARD_ROWS/COLS, STARTING_RODS', () => {
    expect(CONFIG.TARGET_SCORE).toBe(24);
    expect(CONFIG.BOARD_ROWS).toBe(3);
    expect(CONFIG.BOARD_COLS).toBe(4);
    expect(CONFIG.STARTING_RODS_PER_PLAYER).toBe(5);
  });
});
