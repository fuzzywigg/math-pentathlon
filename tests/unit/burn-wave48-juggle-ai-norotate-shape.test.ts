/**
 * Wave 48 — Juggle getAIPlacement works for non-rotating shapes. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { getAIPlacement } from '../../src/games/juggle/ai';
import { getShapesForDie, type JuggleState } from '../../src/games/juggle/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 juggle — norotate shape placement', () => {
  it('places monomino/domino without requiring rotation', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const shapes = getShapesForDie(1);
    const shape = shapes.find((s) => !s.canRotate) ?? shapes[0];
    const state: JuggleState = {
      ...createInitialState(),
      currentDice: [1, 1],
      selectedCategory: 'monomino',
      selectedShape: shape,
      phase: 'placing',
    };
    const placement = getAIPlacement(state, 'player1', 'hard');
    expect(placement).not.toBeNull();
    expect(placement!.rotation).toBe(0);
  });
});
