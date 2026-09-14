/**
 * Wave 43 — Juggle dice→category/pool catalog leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  DICE_TO_CATEGORY,
  SHAPE_POOLS,
  getShapesForDie,
} from '../../src/games/juggle/types';

describe('Wave 43 juggle — dice category catalog', () => {
  it('maps 1..6 and die6→pentomino; pools nonempty', () => {
    expect(DICE_TO_CATEGORY[1]).toBe('monomino');
    expect(DICE_TO_CATEGORY[6]).toBe('pentomino');
    for (let d = 1; d <= 6; d++) {
      expect(getShapesForDie(d).length).toBeGreaterThan(0);
      expect(getShapesForDie(d)).toEqual(SHAPE_POOLS[DICE_TO_CATEGORY[d]]);
    }
  });
});
