/**
 * Overnight TOKENMAXX — Hex-a-Gone getBlockColor catalog leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { BLOCK_COLORS, type BlockShape } from '../../src/games/hex-a-gone/types';
import { getBlockColor } from '../../src/games/hex-a-gone/rules';

describe('Overnight hexagone — block colors', () => {
  it('all shapes match BLOCK_COLORS', () => {
    for (const shape of Object.keys(BLOCK_COLORS) as BlockShape[]) {
      expect(getBlockColor(shape)).toBe(BLOCK_COLORS[shape]);
    }
  });
});
