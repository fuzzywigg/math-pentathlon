/**
 * Wave 40 — Juggle flip-frozen / preview empty / place reject.
 * Tests-only leftover after #178.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  flipShape,
  rotateShape,
  getPreviewCells,
  placeShape,
} from '../../src/games/juggle/rules';
import type { PolyominoShape } from '../../src/core/polyomino/types';

const frozen: PolyominoShape = {
  id: 'frozen-monomino',
  name: 'frozen',
  cells: [{ row: 0, col: 0 }],
  canRotate: true,
  canFlip: false,
};

describe('Wave 40 juggle — flip / preview / place', () => {
  it('flipShape identity when canFlip false; rotate still advances', () => {
    const state = {
      ...createInitialState(),
      phase: 'placing' as const,
      selectedShape: frozen,
      selectedRotation: 0 as const,
      selectedFlipped: false,
      currentDice: [1, 1] as [number, number],
    };
    expect(flipShape(state)).toBe(state);
    const rotated = rotateShape(state);
    expect(rotated).not.toBe(state);
    expect(rotated.selectedRotation).toBe(90);
  });

  it('getPreviewCells empty without shape; placeShape rejects', () => {
    const state = createInitialState();
    expect(getPreviewCells(state, { row: 0, col: 0 })).toEqual([]);
    expect(placeShape(state, { row: 0, col: 0 })).toBe(state);

    const placingNoDice = {
      ...state,
      phase: 'placing' as const,
      selectedShape: frozen,
      currentDice: null,
    };
    expect(placeShape(placingNoDice, { row: 0, col: 0 })).toBe(placingNoDice);
  });
});
