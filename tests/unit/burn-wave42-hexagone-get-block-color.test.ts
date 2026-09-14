/**
 * Wave 42 leftovers D — Hex-a-Gone get block color. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  BLOCK_COLORS,
  type BlockShape,
} from '../../src/games/hex-a-gone/types';
import { getBlockColor } from '../../src/games/hex-a-gone/rules';

const SHAPES: BlockShape[] = [
  'hexagon',
  'trapezoid',
  'rhombus',
  'triangle',
  'square',
];

describe('Wave 42 hexagone — getBlockColor matches BLOCK_COLORS', () => {
  it('matches BLOCK_COLORS for all shapes', () => {
    for (const shape of SHAPES) {
      expect(getBlockColor(shape)).toBe(BLOCK_COLORS[shape]);
    }
  });
});
