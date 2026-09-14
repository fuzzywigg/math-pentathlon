/**
 * Overnight TOKENMAXX — Stars COLOR_VALUES catalog leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { COLOR_VALUES, COLORS, SHAPES, SIZES, THICKNESSES, CONFIG } from '../../src/games/stars-bars/types';

describe('Overnight stars — catalogs', () => {
  it('color hex and attribute catalogs', () => {
    expect(Object.keys(COLOR_VALUES).sort()).toEqual([...COLORS].sort());
    expect(COLOR_VALUES.red).toBe('#e53935');
    expect(COLOR_VALUES.blue).toBe('#1976d2');
    expect(COLOR_VALUES.yellow).toBe('#fdd835');
    expect(SHAPES).toHaveLength(5);
    expect(SIZES).toEqual(['small', 'large']);
    expect(THICKNESSES).toEqual(['thin', 'thick']);
    expect(CONFIG.TARGET_SCORE).toBe(30);
    expect(CONFIG.BOARD_SIZE).toBe(5);
  });
});
