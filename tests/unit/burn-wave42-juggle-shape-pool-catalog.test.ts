/**
 * Wave 42 leftovers D — juggle shape pool / category catalog. Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  DICE_TO_CATEGORY,
  SHAPE_POOLS,
  ALL_SHAPES,
  CONFIG,
  getShapesForDie,
  getShapeById,
  getCategoryName,
  getCategoryFromDie,
  rollDice,
} from '../../src/games/juggle/types';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 42 D juggle — shape pools + die catalog', () => {
  it('DICE_TO_CATEGORY maps 5 and 6 to pentomino; unknown falls back', () => {
    expect(DICE_TO_CATEGORY[5]).toBe('pentomino');
    expect(DICE_TO_CATEGORY[6]).toBe('pentomino');
    expect(getCategoryFromDie(99)).toBe('monomino');
  });

  it('SHAPE_POOLS nonempty per category; getShapesForDie matches pool', () => {
    for (const [die, cat] of Object.entries(DICE_TO_CATEGORY)) {
      const pool = SHAPE_POOLS[cat as keyof typeof SHAPE_POOLS];
      expect(pool.length).toBeGreaterThan(0);
      expect(getShapesForDie(Number(die))).toEqual(pool);
    }
  });

  it('getShapeById finds ALL_SHAPES ids and misses unknown', () => {
    expect(ALL_SHAPES.length).toBeGreaterThan(10);
    const first = ALL_SHAPES[0];
    expect(getShapeById(first.id)?.id).toBe(first.id);
    expect(getShapeById('no-such-shape-zzz')).toBeUndefined();
  });

  it('getCategoryName labels and CONFIG grid size', () => {
    expect(getCategoryName('tromino')).toContain('3');
    expect(getCategoryName('pentomino')).toContain('5');
    expect(CONFIG.GRID_SIZE).toBe(9);
    expect(CONFIG.CELLS_TO_FILL).toBe(81);
  });

  it('rollDice returns two faces in 1..6', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.999);
    expect(rollDice()).toEqual([1, 6]);
  });
});
