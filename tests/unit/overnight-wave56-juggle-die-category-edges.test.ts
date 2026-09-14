/**
 * Wave 56 leftover after #256 — Juggle die=4→5/6 category + pentomino fallback.
 * getCategoryFromDie unknown falls to monomino (existing). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getCategoryFromDie,
  getShapesForDie,
  DICE_TO_CATEGORY,
} from '../../src/games/juggle/types';

describe('Wave 56 juggle — die category edges', () => {
  it('maps 5 and 6 to pentomino; unknown falls back to monomino', () => {
    expect(getCategoryFromDie(5)).toBe('pentomino');
    expect(getCategoryFromDie(6)).toBe('pentomino');
    expect(DICE_TO_CATEGORY[5]).toBe(DICE_TO_CATEGORY[6]);
    expect(getShapesForDie(5).length).toBe(getShapesForDie(6).length);
    expect(getCategoryFromDie(0 as number)).toBe('monomino');
    expect(getCategoryFromDie(99 as number)).toBe('monomino');
  });
});
