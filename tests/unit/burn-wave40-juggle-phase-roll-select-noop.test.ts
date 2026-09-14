/**
 * Wave 40 — Juggle wrong-phase roll/select no-ops.
 * Tests-only leftover after #178.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  doRollDice,
  selectDie,
  selectShape,
} from '../../src/games/juggle/rules';
import type { PolyominoShape } from '../../src/core/polyomino/types';

describe('Wave 40 juggle — phase roll/select noops', () => {
  it('doRollDice identity when not rolling', () => {
    const state = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
    };
    expect(doRollDice(state)).toBe(state);
  });

  it('selectDie identity without dice or wrong phase', () => {
    const state = createInitialState();
    expect(selectDie(state, 0)).toBe(state);
    const rolling = { ...state, phase: 'rolling' as const, currentDice: [3, 4] as [number, number] };
    expect(selectDie(rolling, 0)).toBe(rolling);
  });

  it('selectShape identity without category', () => {
    const ghostShape = {
      id: 'ghost',
      name: 'ghost',
      cells: [{ row: 0, col: 0 }],
      canRotate: true,
      canFlip: true,
    } as PolyominoShape;
    const state = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [2, 5] as [number, number],
      selectedCategory: null,
    };
    expect(selectShape(state, ghostShape)).toBe(state);
  });
});
