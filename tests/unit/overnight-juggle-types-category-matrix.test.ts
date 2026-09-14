/**
 * Overnight HEAVY after #214/#215 — Juggle die→category catalog leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  DICE_TO_CATEGORY,
  getCategoryFromDie,
  getCategoryName,
  getShapesForDie,
  CONFIG,
} from '../../src/games/juggle/types';

describe('Overnight juggle — category matrix', () => {
  it('dice 1..6 map to named categories with nonempty pools', () => {
    for (let d = 1; d <= 6; d++) {
      const cat = getCategoryFromDie(d);
      expect(cat).toBe(DICE_TO_CATEGORY[d]);
      expect(getCategoryName(cat).length).toBeGreaterThan(0);
      expect(getShapesForDie(d).length).toBeGreaterThan(0);
    }
    expect(CONFIG.GRID_SIZE).toBe(9);
  });
});
