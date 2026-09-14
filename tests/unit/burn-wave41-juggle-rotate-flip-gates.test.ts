/**
 * Wave 41 — Juggle rotateShape cycle + flipShape canFlip gate leftovers. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectDie,
  selectShape,
  rotateShape,
  flipShape,
} from '../../src/games/juggle/rules';
import { PENTOMINOES, TETROMINOES } from '../../src/core/polyomino/types';

function placingWith(shape: (typeof TETROMINOES)[number]) {
  let state = {
    ...createInitialState(),
    currentDice: [4, 5] as [number, number],
    phase: 'selectingShape' as const,
  };
  state = selectDie(state, 0);
  if (state.phase === 'selectingShape') {
    state = selectShape(state, shape);
  } else {
    state = { ...state, selectedShape: shape, phase: 'placing' };
  }
  return state;
}

describe('Wave 41 Juggle — rotateShape cycle', () => {
  it('cycles 0 → 90 → 180 → 270 → 0 while placing', () => {
    let state = placingWith(TETROMINOES[0]);
    expect(state.phase).toBe('placing');
    expect(state.selectedRotation).toBe(0);
    state = rotateShape(state);
    expect(state.selectedRotation).toBe(90);
    state = rotateShape(state);
    expect(state.selectedRotation).toBe(180);
    state = rotateShape(state);
    expect(state.selectedRotation).toBe(270);
    state = rotateShape(state);
    expect(state.selectedRotation).toBe(0);
  });

  it('rotateShape is identity when not placing or no shape', () => {
    const rolling = createInitialState();
    expect(rotateShape(rolling)).toBe(rolling);
    const selecting = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [4, 4] as [number, number],
      selectedCategory: 'tetromino' as const,
      selectedShape: TETROMINOES[0],
    };
    expect(rotateShape(selecting)).toBe(selecting);
    const placingNoShape = {
      ...createInitialState(),
      phase: 'placing' as const,
      selectedShape: null,
    };
    expect(rotateShape(placingNoShape)).toBe(placingNoShape);
  });
});

describe('Wave 41 Juggle — flipShape canFlip gate', () => {
  it('toggles flipped when shape.canFlip is true', () => {
    const flippable = PENTOMINOES.find((s) => s.canFlip);
    expect(flippable).toBeDefined();
    let state = {
      ...createInitialState(),
      currentDice: [5, 1] as [number, number],
      phase: 'selectingShape' as const,
    };
    state = selectDie(state, 0);
    if (state.phase === 'selectingShape' || !state.selectedShape?.canFlip) {
      state = {
        ...state,
        phase: 'selectingShape',
        selectedCategory: 'pentomino',
        selectedShape: null,
      };
      state = selectShape(state, flippable!);
    }
    expect(state.phase).toBe('placing');
    expect(state.selectedFlipped).toBe(false);
    state = flipShape(state);
    expect(state.selectedFlipped).toBe(true);
    state = flipShape(state);
    expect(state.selectedFlipped).toBe(false);
  });

  it('flipShape is identity when canFlip is false', () => {
    const noFlip = TETROMINOES.find((s) => !s.canFlip) ?? TETROMINOES[0];
    const state = {
      ...createInitialState(),
      phase: 'placing' as const,
      currentDice: [4, 4] as [number, number],
      selectedCategory: 'tetromino' as const,
      selectedShape: { ...noFlip, canFlip: false },
      selectedFlipped: false,
    };
    expect(flipShape(state)).toBe(state);
  });

  it('flipShape is identity outside placing', () => {
    const state = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      selectedShape: PENTOMINOES.find((s) => s.canFlip)!,
    };
    expect(flipShape(state)).toBe(state);
  });
});
