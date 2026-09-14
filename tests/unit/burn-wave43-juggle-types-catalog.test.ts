/**
 * Wave 43 — Juggle types catalog leftovers (die→category, pools, names). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  DICE_TO_CATEGORY,
  SHAPE_POOLS,
  getCategoryFromDie,
  getShapesForDie,
  getShapeById,
  getCategoryName,
  CONFIG,
  getOpponent,
} from '../../src/games/juggle/types';

describe('Wave 43 juggle — types catalog', () => {
  it('dice 1-6 map categories; 5 and 6 share pentomino', () => {
    expect(DICE_TO_CATEGORY[1]).toBe('monomino');
    expect(DICE_TO_CATEGORY[2]).toBe('domino');
    expect(DICE_TO_CATEGORY[3]).toBe('tromino');
    expect(DICE_TO_CATEGORY[4]).toBe('tetromino');
    expect(DICE_TO_CATEGORY[5]).toBe('pentomino');
    expect(DICE_TO_CATEGORY[6]).toBe('pentomino');
    expect(getCategoryFromDie(5)).toBe(getCategoryFromDie(6));
  });

  it('pools nonempty and sizes match category', () => {
    expect(SHAPE_POOLS.monomino.every((s) => s.size === 1)).toBe(true);
    expect(SHAPE_POOLS.domino.every((s) => s.size === 2)).toBe(true);
    expect(SHAPE_POOLS.tromino.every((s) => s.size === 3)).toBe(true);
    expect(SHAPE_POOLS.tetromino.length).toBeGreaterThan(0);
    expect(SHAPE_POOLS.pentomino.length).toBeGreaterThan(0);
    expect(getShapesForDie(1)).toEqual(SHAPE_POOLS.monomino);
    expect(getShapesForDie(6)).toEqual(SHAPE_POOLS.pentomino);
  });

  it('getShapeById / getCategoryName / CONFIG / opponent', () => {
    const mono = getShapesForDie(1)[0];
    expect(getShapeById(mono.id)?.id).toBe(mono.id);
    expect(getShapeById('no-such-shape-xyz')).toBeUndefined();
    expect(getCategoryName('monomino')).toContain('Monomino');
    expect(getCategoryName('pentomino')).toContain('Pentomino');
    expect(CONFIG.GRID_SIZE).toBe(9);
    expect(CONFIG.CELLS_TO_FILL).toBe(81);
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
  });
});
