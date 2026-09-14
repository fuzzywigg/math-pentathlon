/**
 * Wave 42 leftovers D — handshake ramrod × stars catalog. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createRodSet,
  CONFIG as RAMROD_CONFIG,
} from '../../src/games/ramrod/types';
import { CONFIG as STARS_CONFIG } from '../../src/games/stars-bars/types';

describe('Wave 42 handshake — ramrod × stars catalog', () => {
  it('rod set + stars CONFIG coexist', () => {
    const rods = createRodSet();
    expect(rods.length).toBeGreaterThan(0);
    expect(RAMROD_CONFIG.TARGET_SCORE).toBe(24);
    expect(STARS_CONFIG.TARGET_SCORE).toBe(30);
    expect(STARS_CONFIG.BOARD_SIZE).toBe(5);
    expect(RAMROD_CONFIG.BOARD_ROWS * RAMROD_CONFIG.BOARD_COLS).toBe(12);
    expect(RAMROD_CONFIG.TARGET_SCORE).not.toBe(STARS_CONFIG.TARGET_SCORE);
  });
});
