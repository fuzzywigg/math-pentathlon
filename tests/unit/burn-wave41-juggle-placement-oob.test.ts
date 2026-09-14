/**
 * Wave 41 — Juggle isPlacementValid OOB + wrong-phase matrix.
 * Far/negative cells reject; placing monomino origin valid. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { SIMPLE_SHAPES } from '../../src/core/polyomino/types';
import { CONFIG } from '../../src/games/juggle/types';
import {
  createInitialState,
  isPlacementValid,
} from '../../src/games/juggle/rules';

const monomino = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
const domino = SIMPLE_SHAPES.find((s) => s.id === 'domino')!;

function placing(shape = monomino) {
  return {
    ...createInitialState(),
    phase: 'placing' as const,
    currentDice: [1, 2] as [number, number],
    selectedShape: shape,
    selectedCategory: 'monomino' as const,
  };
}

describe('Wave 41 juggle — isPlacementValid OOB', () => {
  it('false outside placing or without shape', () => {
    const rolling = createInitialState();
    expect(isPlacementValid(rolling, { row: 0, col: 0 })).toBe(false);
    const selecting = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [1, 1] as [number, number],
      selectedShape: monomino,
    };
    expect(isPlacementValid(selecting, { row: 0, col: 0 })).toBe(false);
    const noShape = { ...placing(), selectedShape: null };
    expect(isPlacementValid(noShape, { row: 0, col: 0 })).toBe(false);
  });

  it('OOB matrix rejects negative and beyond grid', () => {
    const state = placing(monomino);
    const n = CONFIG.GRID_SIZE;
    const oob = [
      { row: -1, col: 0 },
      { row: 0, col: -1 },
      { row: -1, col: -1 },
      { row: n, col: 0 },
      { row: 0, col: n },
      { row: n, col: n },
      { row: n + 5, col: n + 5 },
      { row: 100, col: -50 },
    ];
    for (const pos of oob) {
      expect(isPlacementValid(state, pos)).toBe(false);
    }
  });

  it('origin and last in-bounds cell valid for monomino', () => {
    const state = placing(monomino);
    const n = CONFIG.GRID_SIZE;
    expect(isPlacementValid(state, { row: 0, col: 0 })).toBe(true);
    expect(isPlacementValid(state, { row: n - 1, col: n - 1 })).toBe(true);
  });

  it('domino overhangs right edge at last column', () => {
    const state = placing(domino);
    const n = CONFIG.GRID_SIZE;
    expect(isPlacementValid(state, { row: 0, col: 0 })).toBe(true);
    expect(isPlacementValid(state, { row: 0, col: n - 1 })).toBe(false);
  });
});
