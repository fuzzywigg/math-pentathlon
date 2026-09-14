/**
 * Wave 43 — Juggle rotateShape 0→90→180→270→0 cycle. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { SIMPLE_SHAPES } from '../../src/core/polyomino/types';
import { createInitialState, rotateShape } from '../../src/games/juggle/rules';

const tromino = SIMPLE_SHAPES.find((s) => s.size === 3)!;

describe('Wave 43 juggle — rotate cycle', () => {
  it('cycles four rotations then wraps', () => {
    let state = {
      ...createInitialState(),
      phase: 'placing' as const,
      currentDice: [3, 3] as [number, number],
      selectedShape: tromino,
      selectedRotation: 0 as const,
    };
    const seen: number[] = [];
    for (let i = 0; i < 4; i++) {
      state = rotateShape(state) as typeof state;
      seen.push(state.selectedRotation);
    }
    expect(seen).toEqual([90, 180, 270, 0]);
  });
});
