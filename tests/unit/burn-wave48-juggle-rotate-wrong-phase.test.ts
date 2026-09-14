/**
 * Wave 48 — Juggle rotate/flip identity off placing phase. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, rotateShape, flipShape } from '../../src/games/juggle/rules';
import { SHAPE_POOLS } from '../../src/games/juggle/types';

describe('Wave 48 juggle — rotate flip wrong phase', () => {
  it('identity when not placing even with shape set', () => {
    const s = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      selectedShape: SHAPE_POOLS.tetromino[0],
      currentDice: [4, 4] as [number, number],
      selectedCategory: 'tetromino' as const,
    };
    expect(rotateShape(s)).toBe(s);
    expect(flipShape(s)).toBe(s);
  });
});
