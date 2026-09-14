/**
 * Wave 41 — Juggle selectDie auto-shape + selectShape category gate leftovers. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectDie,
  selectShape,
} from '../../src/games/juggle/rules';
import { getShapesForDie } from '../../src/games/juggle/types';
import { TETROMINOES, PENTOMINOES } from '../../src/core/polyomino/types';

function withDice(dice: [number, number]) {
  return {
    ...createInitialState(),
    currentDice: dice,
    phase: 'selectingShape' as const,
  };
}

describe('Wave 41 Juggle — selectDie auto-shape', () => {
  it('auto-selects sole monomino and jumps to placing', () => {
    const shapes = getShapesForDie(1);
    expect(shapes).toHaveLength(1);
    const next = selectDie(withDice([1, 5]), 0);
    expect(next.selectedCategory).toBe('monomino');
    expect(next.selectedShape).toBe(shapes[0]);
    expect(next.phase).toBe('placing');
    expect(next.selectedRotation).toBe(0);
    expect(next.selectedFlipped).toBe(false);
  });

  it('auto-selects sole domino and jumps to placing', () => {
    const shapes = getShapesForDie(2);
    expect(shapes).toHaveLength(1);
    const next = selectDie(withDice([2, 3]), 0);
    expect(next.selectedCategory).toBe('domino');
    expect(next.selectedShape?.size).toBe(2);
    expect(next.phase).toBe('placing');
  });

  it('leaves multi-shape tetromino in selectingShape without auto-shape', () => {
    const shapes = getShapesForDie(4);
    expect(shapes.length).toBeGreaterThan(1);
    const next = selectDie(withDice([4, 1]), 0);
    expect(next.selectedCategory).toBe('tetromino');
    expect(next.selectedShape).toBeNull();
    expect(next.phase).toBe('selectingShape');
  });

  it('selectDie is identity outside selectingShape or without dice', () => {
    const rolling = createInitialState();
    expect(selectDie(rolling, 0)).toBe(rolling);
    const placing = {
      ...withDice([3, 3]),
      phase: 'placing' as const,
      selectedCategory: 'tromino' as const,
      selectedShape: getShapesForDie(3)[0],
    };
    expect(selectDie(placing, 0)).toBe(placing);
    const noDice = { ...withDice([1, 1]), currentDice: null };
    expect(selectDie(noDice, 1)).toBe(noDice);
  });
});

describe('Wave 41 Juggle — selectShape category gate', () => {
  it('rejects selectShape without selectedCategory', () => {
    const state = withDice([4, 5]);
    expect(state.selectedCategory).toBeNull();
    expect(selectShape(state, TETROMINOES[0])).toBe(state);
  });

  it('rejects selectShape outside selectingShape even with category', () => {
    const state = {
      ...withDice([4, 4]),
      selectedCategory: 'tetromino' as const,
      phase: 'placing' as const,
      selectedShape: TETROMINOES[0],
    };
    expect(selectShape(state, TETROMINOES[1] ?? TETROMINOES[0])).toBe(state);
  });

  it('selectShape after die choice advances to placing with resets', () => {
    let state = selectDie(withDice([4, 5]), 0);
    expect(state.selectedCategory).toBe('tetromino');
    expect(state.phase).toBe('selectingShape');
    state = selectShape(state, TETROMINOES[0]);
    expect(state.selectedShape).toBe(TETROMINOES[0]);
    expect(state.phase).toBe('placing');
    expect(state.selectedRotation).toBe(0);
    expect(state.selectedFlipped).toBe(false);
  });

  it('selectShape accepts a pentomino after die 5 when category set', () => {
    let state = selectDie(withDice([5, 2]), 0);
    if (state.phase === 'placing') {
      expect(state.selectedShape?.size).toBe(5);
      return;
    }
    state = selectShape(state, PENTOMINOES[0]);
    expect(state.phase).toBe('placing');
    expect(state.selectedShape?.size).toBe(5);
  });
});
