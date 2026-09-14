/**
 * Wave 42 leftovers D — handshake D-slice openings. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState as hexInit,
  INITIAL_BANK,
} from '../../src/games/hex-a-gone/types';
import { createInitialState as starsInit } from '../../src/games/stars-bars/rules';
import { createInitialState as ramrodInit } from '../../src/games/ramrod/rules';
import { CONFIG as RAMROD_CONFIG } from '../../src/games/ramrod/types';

describe('Wave 42 handshake — D-slice openings', () => {
  it('hexagone bank sum + stars star cells + ramrod box count', () => {
    const h = hexInit();
    const s = starsInit();
    const r = ramrodInit();

    const bankSum = Object.values(h.bank).reduce((a, b) => a + b, 0);
    const expectedBank = Object.values(INITIAL_BANK).reduce((a, b) => a + b, 0);
    expect(bankSum).toBe(expectedBank);
    expect(bankSum).toBeGreaterThan(0);

    const starCoords = [
      [0, 0],
      [0, 4],
      [2, 2],
      [4, 0],
      [4, 4],
    ] as const;
    for (const [row, col] of starCoords) {
      expect(s.cells[row][col].isStar).toBe(true);
    }

    expect(r.boxes.size).toBe(
      RAMROD_CONFIG.BOARD_ROWS * RAMROD_CONFIG.BOARD_COLS
    );
  });
});
