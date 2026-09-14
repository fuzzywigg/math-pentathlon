/**
 * Wave 40 — Juggle rotate/flip/preview/place no-ops + canFlip guard.
 * After #177; tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  rotateShape,
  flipShape,
  getPreviewCells,
  isPlacementValid,
  placeShape,
} from '../../src/games/juggle/rules';
import { SHAPE_POOLS } from '../../src/games/juggle/types';
import type { PolyominoShape } from '../../src/core/polyomino/types';

function placingState(shape: PolyominoShape) {
  return {
    ...createInitialState(),
    phase: 'placing' as const,
    currentDice: [4, 5] as [number, number],
    selectedCategory: 'tetromino' as const,
    selectedShape: shape,
    selectedRotation: 0 as const,
    selectedFlipped: false,
  };
}

describe('Wave 40 juggle — flip/rotate/place leftovers', () => {
  it('rotate/flip identity when not placing or no shape', () => {
    const idle = createInitialState();
    expect(rotateShape(idle)).toBe(idle);
    expect(flipShape(idle)).toBe(idle);
  });

  it('rotate advances 0→90; flip no-ops when !canFlip', () => {
    const mono = SHAPE_POOLS.monomino[0];
    const state = placingState(mono);
    const rotated = rotateShape(state);
    expect(rotated.selectedRotation).toBe(90);
    // monomino typically cannot flip meaningfully — canFlip false → identity
    if (!mono.canFlip) {
      expect(flipShape(state)).toBe(state);
    } else {
      expect(flipShape(state).selectedFlipped).toBe(true);
    }
  });

  it('flip toggles when canFlip; preview empty without shape', () => {
    const flippable =
      SHAPE_POOLS.tetromino.find((s) => s.canFlip) ?? SHAPE_POOLS.pentomino[0];
    const state = placingState(flippable);
    if (flippable.canFlip) {
      const flipped = flipShape(state);
      expect(flipped.selectedFlipped).toBe(true);
      expect(flipShape(flipped).selectedFlipped).toBe(false);
    }
    expect(getPreviewCells(createInitialState(), { row: 0, col: 0 })).toEqual(
      []
    );
    expect(getPreviewCells(state, { row: 0, col: 0 }).length).toBeGreaterThan(
      0
    );
  });

  it('isPlacementValid false outside placing; invalid place is identity', () => {
    const shape = SHAPE_POOLS.pentomino[0];
    const state = placingState(shape);
    expect(isPlacementValid(createInitialState(), { row: 0, col: 0 })).toBe(
      false
    );
    // Far OOB-ish large position should reject
    const bad = placeShape(state, { row: 50, col: 50 });
    expect(bad).toBe(state);
  });
});
