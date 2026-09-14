/**
 * Wave 40 — Juggle doRollDice / selectDie / selectShape phase no-ops.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { TETROMINOES } from '../../src/core/polyomino/types';
import {
  createInitialState,
  doRollDice,
  selectDie,
  selectShape,
} from '../../src/games/juggle/rules';

describe('Wave 40 juggle — phase roll/select noop', () => {
  it('doRollDice identity when phase !== rolling', () => {
    const state = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [3, 4] as [number, number],
    };
    const next = doRollDice(state);
    expect(next).toBe(state);
  });

  it('selectDie identity when phase !== selectingShape', () => {
    const state = createInitialState(); // phase rolling, currentDice null
    const next = selectDie(state, 0);
    expect(next).toBe(state);
  });

  it('selectDie identity when currentDice null in selectingShape', () => {
    const state = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: null,
    };
    const next = selectDie(state, 1);
    expect(next).toBe(state);
  });

  it('selectShape identity without selectedCategory', () => {
    const state = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [4, 5] as [number, number],
      selectedCategory: null,
    };
    const next = selectShape(state, TETROMINOES[0]);
    expect(next).toBe(state);
  });
});
