/**
 * Wave 40 — Juggle flipShape canFlip=false + preview/place identity.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { TETROMINOES } from '../../src/core/polyomino/types';
import {
  createInitialState,
  flipShape,
  rotateShape,
  getPreviewCells,
  placeShape,
} from '../../src/games/juggle/rules';

describe('Wave 40 juggle — flip frozen / preview / place identity', () => {
  it('flipShape identity when canFlip=false; rotateShape still advances', () => {
    const frozen = TETROMINOES.find((s) => s.canFlip === false && s.canRotate)!;
    expect(frozen.canFlip).toBe(false);

    const state = {
      ...createInitialState(),
      phase: 'placing' as const,
      currentDice: [4, 4] as [number, number],
      selectedCategory: 'tetromino' as const,
      selectedShape: frozen,
      selectedRotation: 0 as const,
      selectedFlipped: false,
    };

    const flipped = flipShape(state);
    expect(flipped).toBe(state);

    const rotated = rotateShape(state);
    expect(rotated).not.toBe(state);
    expect(rotated.selectedRotation).toBe(90);
  });

  it('getPreviewCells empty with no selectedShape', () => {
    const state = createInitialState();
    expect(state.selectedShape).toBeNull();
    expect(getPreviewCells(state, { row: 0, col: 0 })).toEqual([]);
  });

  it('placeShape identity wrong phase / no shape', () => {
    const rolling = createInitialState();
    expect(placeShape(rolling, { row: 0, col: 0 })).toBe(rolling);

    const noShape = {
      ...createInitialState(),
      phase: 'placing' as const,
      currentDice: [1, 1] as [number, number],
      selectedShape: null,
    };
    expect(placeShape(noShape, { row: 0, col: 0 })).toBe(noShape);
  });
});
