/**
 * Wave 43 — Juggle selectDie category matrix across dice faces. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState, selectDie } from '../../src/games/juggle/rules';
import { DICE_TO_CATEGORY, getShapesForDie } from '../../src/games/juggle/types';

describe('Wave 43 juggle — selectDie category matrix', () => {
  it('identity when phase is not selectingShape', () => {
    const s = createInitialState();
    expect(selectDie(s, 0)).toBe(s);
  });

  it('identity when dice missing even in selectingShape', () => {
    const s = { ...createInitialState(), phase: 'selectingShape' as const, currentDice: null };
    expect(selectDie(s, 0)).toBe(s);
  });

  it('die0 and die1 map to their categories; single-option auto-places', () => {
    for (const face of [1, 2, 3, 4, 5, 6] as const) {
      const base = {
        ...createInitialState(),
        phase: 'selectingShape' as const,
        currentDice: [face, face] as [number, number],
      };
      const next = selectDie(base, 0);
      expect(next.selectedCategory).toBe(DICE_TO_CATEGORY[face]);
      const shapes = getShapesForDie(face);
      if (shapes.length === 1) {
        expect(next.phase).toBe('placing');
        expect(next.selectedShape?.id).toBe(shapes[0].id);
      } else {
        expect(next.phase).toBe('selectingShape');
        expect(next.selectedShape).toBeNull();
      }
    }
  });

  it('dieIndex 1 uses the second face when dice differ', () => {
    const base = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [1, 4] as [number, number],
    };
    const next = selectDie(base, 1);
    expect(next.selectedCategory).toBe('tetromino');
  });
});
