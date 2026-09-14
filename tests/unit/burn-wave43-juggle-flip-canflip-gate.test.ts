/**
 * Wave 43 — Juggle flipShape canFlip gate leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { SIMPLE_SHAPES, TETROMINOES } from '../../src/core/polyomino/types';
import { createInitialState, flipShape } from '../../src/games/juggle/rules';

const monomino = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
const flipable =
  TETROMINOES.find((s) => s.canFlip) ?? SIMPLE_SHAPES.find((s) => s.canFlip);

describe('Wave 43 juggle — flip canFlip gate', () => {
  it('flip identity when shape cannot flip', () => {
    const state = {
      ...createInitialState(),
      phase: 'placing' as const,
      currentDice: [1, 1] as [number, number],
      selectedShape: monomino,
      selectedFlipped: false,
    };
    expect(monomino.canFlip).toBeFalsy();
    expect(flipShape(state)).toBe(state);
  });

  it('flip toggles when shape canFlip', () => {
    expect(flipable).toBeTruthy();
    const state = {
      ...createInitialState(),
      phase: 'placing' as const,
      currentDice: [4, 4] as [number, number],
      selectedShape: flipable!,
      selectedFlipped: false,
    };
    const next = flipShape(state);
    expect(next).not.toBe(state);
    expect(next.selectedFlipped).toBe(true);
    expect(flipShape(next).selectedFlipped).toBe(false);
  });
});
