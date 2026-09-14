/**
 * Wave 47 leftover after #214/#215 leftovers D — stars config catalog. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  CONFIG,
  SHAPES,
  COLORS,
  SIZES,
  THICKNESSES,
  COLOR_VALUES,
} from '../../src/games/stars-bars/types';

describe('Wave 47 stars deepen 12 — stars — config catalog', () => {
  it('CONFIG sizes and attribute catalog lengths / COLOR_VALUES keys', () => {
    expect(CONFIG.BOARD_SIZE).toBe(5);
    expect(CONFIG.HAND_SIZE).toBe(5);
    expect(CONFIG.TARGET_SCORE).toBe(30);

    expect(SHAPES).toHaveLength(5);
    expect(COLORS).toHaveLength(3);
    expect(SIZES).toHaveLength(2);
    expect(THICKNESSES).toHaveLength(2);

    expect(Object.keys(COLOR_VALUES).sort()).toEqual(
      [...COLORS].sort()
    );
    for (const color of COLORS) {
      expect(COLOR_VALUES[color]).toMatch(/^#/);
    }
  });
});
