/**
 * Overnight HEAVY after #214/#215 — Stars CONFIG/catalog leftovers. Tests-only.
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
import { createInitialState } from '../../src/games/stars-bars/rules';

describe('Overnight stars-bars — config catalog', () => {
  it('catalog sizes and opening hands', () => {
    expect(SHAPES.length).toBeGreaterThan(0);
    expect(COLORS.length).toBe(3);
    expect(SIZES.length).toBe(2);
    expect(THICKNESSES.length).toBe(2);
    for (const c of COLORS) expect(COLOR_VALUES[c]).toMatch(/^#/);
    const s = createInitialState();
    expect(s.playerHands.player1.length).toBe(CONFIG.HAND_SIZE);
    expect(CONFIG.TARGET_SCORE).toBeGreaterThan(0);
    expect(CONFIG.BOARD_SIZE).toBeGreaterThan(0);
  });
});
