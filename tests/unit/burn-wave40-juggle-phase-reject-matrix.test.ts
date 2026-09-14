/**
 * Wave 40 — Juggle phase-identity reject matrix (roll/select leftovers).
 * After #177; tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  doRollDice,
  selectDie,
  selectShape,
  placeShape,
} from '../../src/games/juggle/rules';
import { SHAPE_POOLS } from '../../src/games/juggle/types';

describe('Wave 40 juggle — phase reject matrix', () => {
  it('doRollDice identity when not rolling', () => {
    const state = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [2, 4] as [number, number],
    };
    expect(doRollDice(state)).toBe(state);
  });

  it('selectDie identity when phase wrong or dice missing', () => {
    const rolling = createInitialState();
    expect(selectDie(rolling, 0)).toBe(rolling);

    const noDice = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: null,
    };
    expect(selectDie(noDice, 0)).toBe(noDice);
  });

  it('selectShape identity without category; success needs selectingShape', () => {
    const noCat = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [3, 5] as [number, number],
      selectedCategory: null,
    };
    const shape = SHAPE_POOLS.tromino[0];
    expect(selectShape(noCat, shape)).toBe(noCat);

    const withCat = {
      ...noCat,
      selectedCategory: 'tromino' as const,
    };
    const next = selectShape(withCat, shape);
    expect(next).not.toBe(withCat);
    expect(next.phase).toBe('placing');
    expect(next.selectedShape).toBe(shape);
  });

  it('placeShape identity outside placing / without shape', () => {
    const state = createInitialState();
    expect(placeShape(state, { row: 0, col: 0 })).toBe(state);
  });
});
