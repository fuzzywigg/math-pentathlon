import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  DICE_TO_CATEGORY,
  getCategoryFromDie,
  getShapesForDie,
  getShapeById,
  getCategoryName,
  getOpponent,
  rollDice,
  ALL_SHAPES,
} from '../../src/games/juggle/types';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Juggle – types helpers', () => {
  it('maps dice 1–6 to categories (6 → pentomino)', () => {
    expect(getCategoryFromDie(1)).toBe('monomino');
    expect(getCategoryFromDie(2)).toBe('domino');
    expect(getCategoryFromDie(3)).toBe('tromino');
    expect(getCategoryFromDie(4)).toBe('tetromino');
    expect(getCategoryFromDie(5)).toBe('pentomino');
    expect(getCategoryFromDie(6)).toBe('pentomino');
    expect(DICE_TO_CATEGORY[6]).toBe('pentomino');
    expect(getCategoryFromDie(99)).toBe('monomino');
  });

  it('getShapesForDie returns pool matching die size category', () => {
    const tetrominoes = getShapesForDie(4);
    expect(tetrominoes.length).toBeGreaterThan(0);
    expect(tetrominoes.every((s) => s.size === 4)).toBe(true);

    const monominoes = getShapesForDie(1);
    expect(monominoes.every((s) => s.size === 1)).toBe(true);

    const pentominoes = getShapesForDie(6);
    expect(pentominoes.every((s) => s.size === 5)).toBe(true);
  });

  it('getShapeById finds known shapes and misses unknowns', () => {
    expect(ALL_SHAPES.length).toBeGreaterThan(0);
    const known = ALL_SHAPES[0];
    expect(getShapeById(known.id)?.id).toBe(known.id);
    expect(getShapeById('definitely-missing-shape-id')).toBeUndefined();
  });

  it('getCategoryName includes cell count text', () => {
    expect(getCategoryName('tromino')).toMatch(/3/);
    expect(getCategoryName('pentomino')).toMatch(/5/);
    expect(getCategoryName('monomino')).toMatch(/1/);
  });

  it('rollDice returns values in 1–6 with pinned RNG', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(rollDice()).toEqual([1, 1]);
    vi.spyOn(Math, 'random').mockReturnValue(0.999);
    expect(rollDice()).toEqual([6, 6]);
  });

  it('getOpponent flips seats', () => {
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
  });
});
