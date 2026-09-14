/**
 * Wave 43 — Hex-a-Gone getBlockColor / BLOCK_COLORS catalog. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { BLOCK_COLORS, type BlockShape } from '../../src/games/hex-a-gone/types';
import { getBlockColor } from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hex-a-gone — block colors', () => {
  it('getBlockColor matches BLOCK_COLORS for all shapes', () => {
    const shapes = Object.keys(BLOCK_COLORS) as BlockShape[];
    for (const shape of shapes) {
      expect(getBlockColor(shape)).toBe(BLOCK_COLORS[shape]);
      expect(getBlockColor(shape).startsWith('#')).toBe(true);
    }
  });
});
