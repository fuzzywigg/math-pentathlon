/**
 * Wave 45 TOKENMAXX — Par-55 CONFIG/shapes catalog leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  CONFIG,
  SHAPES,
  COLORS,
  SIZES,
  THICKNESSES,
  createBlockSet,
  createBaseId,
} from '../../src/games/par-55/types';

describe('Wave 45 par55 — config catalog', () => {
  it('target/hand and full attribute lattice', () => {
    expect(CONFIG.TARGET_SCORE).toBe(55);
    expect(CONFIG.HAND_SIZE).toBe(5);
    expect(SHAPES).toHaveLength(5);
    expect(COLORS).toHaveLength(3);
    expect(SIZES).toHaveLength(2);
    expect(THICKNESSES).toHaveLength(2);
    expect(createBlockSet()).toHaveLength(5 * 3 * 2 * 2);
    expect(createBaseId(2, 3)).toBe('base-2-3');
  });
});
