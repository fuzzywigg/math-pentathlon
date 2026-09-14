/**
 * Wave 43 — Juggle selectShape phase/category gates. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState, selectShape } from '../../src/games/juggle/rules';
import { SHAPE_POOLS } from '../../src/games/juggle/types';

describe('Wave 43 juggle — selectShape phase gate', () => {
  it('rejects without selectedCategory or wrong phase', () => {
    const rolling = createInitialState();
    const shape = SHAPE_POOLS.tetromino[0];
    expect(selectShape(rolling, shape)).toBe(rolling);

    const noCat = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [4, 4] as [number, number],
      selectedCategory: null,
    };
    expect(selectShape(noCat, shape)).toBe(noCat);
  });

  it('advances to placing and resets rotation/flip', () => {
    const shape = SHAPE_POOLS.tromino[0];
    const base = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [3, 3] as [number, number],
      selectedCategory: 'tromino' as const,
      selectedRotation: 90 as const,
      selectedFlipped: true,
    };
    const next = selectShape(base, shape);
    expect(next.phase).toBe('placing');
    expect(next.selectedShape).toBe(shape);
    expect(next.selectedRotation).toBe(0);
    expect(next.selectedFlipped).toBe(false);
  });
});
