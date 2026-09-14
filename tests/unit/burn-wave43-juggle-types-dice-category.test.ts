/**
 * Wave 43 — Juggle dice→category catalog leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  DICE_TO_CATEGORY,
  SHAPE_POOLS,
  CONFIG,
  getCategoryFromDie,
  getShapesForDie,
  getCategoryName,
  getOpponent,
  getShapeById,
  ALL_SHAPES,
} from '../../src/games/juggle/types';

describe('Wave 43 juggle — types dice/category catalog', () => {
  it('maps dice 1..6 onto the five shape categories (6 shares pentomino)', () => {
    expect(DICE_TO_CATEGORY[1]).toBe('monomino');
    expect(DICE_TO_CATEGORY[2]).toBe('domino');
    expect(DICE_TO_CATEGORY[3]).toBe('tromino');
    expect(DICE_TO_CATEGORY[4]).toBe('tetromino');
    expect(DICE_TO_CATEGORY[5]).toBe('pentomino');
    expect(DICE_TO_CATEGORY[6]).toBe('pentomino');
  });

  it('getCategoryFromDie falls back to monomino for unknown values', () => {
    expect(getCategoryFromDie(0)).toBe('monomino');
    expect(getCategoryFromDie(99)).toBe('monomino');
  });

  it('SHAPE_POOLS sizes match category cell counts', () => {
    expect(SHAPE_POOLS.monomino.every((s) => s.size === 1)).toBe(true);
    expect(SHAPE_POOLS.domino.every((s) => s.size === 2)).toBe(true);
    expect(SHAPE_POOLS.tromino.every((s) => s.size === 3)).toBe(true);
    expect(SHAPE_POOLS.tetromino.every((s) => s.size === 4)).toBe(true);
    expect(SHAPE_POOLS.pentomino.every((s) => s.size === 5)).toBe(true);
  });

  it('getShapesForDie returns the matching pool', () => {
    expect(getShapesForDie(4)).toEqual(SHAPE_POOLS.tetromino);
    expect(getShapesForDie(6)).toEqual(SHAPE_POOLS.pentomino);
  });

  it('getCategoryName labels every category', () => {
    for (const cat of Object.keys(SHAPE_POOLS) as Array<keyof typeof SHAPE_POOLS>) {
      expect(getCategoryName(cat)).toMatch(/\(/);
    }
  });

  it('CONFIG is a 9x9 fill race and getOpponent flips seats', () => {
    expect(CONFIG.GRID_SIZE).toBe(9);
    expect(CONFIG.CELLS_TO_FILL).toBe(81);
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
  });

  it('getShapeById resolves ALL_SHAPES and misses ghosts', () => {
    const sample = ALL_SHAPES[0];
    expect(getShapeById(sample.id)).toEqual(sample);
    expect(getShapeById('no-such-shape')).toBeUndefined();
  });
});
