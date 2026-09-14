/**
 * Wave 42 — Stars & Bars SHAPES/COLORS/SIZES/THICKNESSES catalog lengths. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  SHAPES,
  COLORS,
  SIZES,
  THICKNESSES,
  CONFIG,
  COLOR_VALUES,
} from '../../src/games/stars-bars/types';
import { createInitialState } from '../../src/games/stars-bars/rules';

describe('Wave 42 stars — catalog lengths', () => {
  it('attribute catalogs multiply to 60 unique cards', () => {
    expect(SHAPES).toHaveLength(5);
    expect(COLORS).toHaveLength(3);
    expect(SIZES).toHaveLength(2);
    expect(THICKNESSES).toHaveLength(2);
    expect(SHAPES.length * COLORS.length * SIZES.length * THICKNESSES.length).toBe(
      60
    );
  });

  it('dealt cards plus deck total 60 unique ids', () => {
    const state = createInitialState();
    const ids = [
      ...state.playerHands.player1,
      ...state.playerHands.player2,
      ...state.deck,
    ].map((c) => c.id);
    expect(ids).toHaveLength(60);
    expect(new Set(ids).size).toBe(60);
    expect(CONFIG.HAND_SIZE).toBe(5);
    expect(CONFIG.BOARD_SIZE).toBe(5);
  });

  it('COLOR_VALUES covers every COLORS entry', () => {
    for (const color of COLORS) {
      expect(COLOR_VALUES[color]).toMatch(/^#/);
    }
  });
});
