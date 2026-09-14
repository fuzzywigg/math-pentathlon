/**
 * Wave 43 — Juggle rotateShape cycle + flipShape canFlip gate. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  rotateShape,
  flipShape,
} from '../../src/games/juggle/rules';
import { SHAPE_POOLS } from '../../src/games/juggle/types';

describe('Wave 43 juggle — rotate/flip cycle', () => {
  function placing(shape = SHAPE_POOLS.tetromino.find((s) => s.canFlip) ?? SHAPE_POOLS.tetromino[0]) {
    return {
      ...createInitialState(),
      phase: 'placing' as const,
      currentDice: [4, 4] as [number, number],
      selectedCategory: 'tetromino' as const,
      selectedShape: shape,
      selectedRotation: 0 as const,
      selectedFlipped: false,
    };
  }

  it('rotate cycles 0→90→180→270→0 only while placing with a shape', () => {
    let s = placing();
    for (const expected of [90, 180, 270, 0] as const) {
      s = rotateShape(s);
      expect(s.selectedRotation).toBe(expected);
    }
    const rolling = createInitialState();
    expect(rotateShape(rolling)).toBe(rolling);
  });

  it('flip toggles when canFlip; identity when cannot', () => {
    const flippable = SHAPE_POOLS.tetromino.find((s) => s.canFlip);
    const unflippable = SHAPE_POOLS.tetromino.find((s) => !s.canFlip) ?? SHAPE_POOLS.monomino[0];
    if (flippable) {
      const a = placing(flippable);
      const b = flipShape(a);
      expect(b.selectedFlipped).toBe(true);
      expect(flipShape(b).selectedFlipped).toBe(false);
    }
    const u = placing(unflippable);
    // monomino/domino may lack canFlip; ensure identity when false
    if (!unflippable.canFlip) {
      expect(flipShape(u)).toBe(u);
    }
  });
});
