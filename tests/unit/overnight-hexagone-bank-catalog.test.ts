/**
 * Overnight HEAVY after #214/#215 — Hex-a-Gone bank catalog leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  INITIAL_BANK,
  BLOCK_SIZES,
  BLOCK_COLORS,
  getAvailableShapes,
} from '../../src/games/hex-a-gone/types';
import { getBlockColor } from '../../src/games/hex-a-gone/rules';

describe('Overnight hex-a-gone — bank catalog', () => {
  it('opening available shapes match positive bank; sizes/colors defined', () => {
    const s = createInitialState();
    const avail = getAvailableShapes(s);
    expect(avail.length).toBeGreaterThan(0);
    for (const shape of avail) {
      expect(INITIAL_BANK[shape]).toBeGreaterThan(0);
      expect(BLOCK_SIZES[shape]).toBeGreaterThan(0);
      expect(BLOCK_COLORS[shape]).toMatch(/^#/);
      expect(getBlockColor(shape)).toBe(BLOCK_COLORS[shape]);
    }
  });
});
