/**
 * Wave 43 — Juggle getPreviewCells / isPlacementValid without shape. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { SIMPLE_SHAPES } from '../../src/core/polyomino/types';
import {
  createInitialState,
  getPreviewCells,
  isPlacementValid,
} from '../../src/games/juggle/rules';

const monomino = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;

describe('Wave 43 juggle — preview/valid without shape', () => {
  it('preview empty and placement invalid when no selectedShape', () => {
    const state = createInitialState();
    expect(getPreviewCells(state, { row: 0, col: 0 })).toEqual([]);
    expect(isPlacementValid(state, { row: 0, col: 0 })).toBe(false);
  });

  it('placement invalid in selectingShape even with forged shape', () => {
    const state = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [1, 2] as [number, number],
      selectedShape: monomino,
    };
    expect(isPlacementValid(state, { row: 4, col: 4 })).toBe(false);
  });
});
