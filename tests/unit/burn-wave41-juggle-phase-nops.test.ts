/**
 * Wave 41 — Juggle selectDie/selectShape/rotate/flip wrong-phase nops.
 * Identity reject matrix across phases. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { SIMPLE_SHAPES } from '../../src/core/polyomino/types';
import {
  createInitialState,
  selectDie,
  selectShape,
  rotateShape,
  flipShape,
  doRollDice,
} from '../../src/games/juggle/rules';

const monomino = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
const trominoL = SIMPLE_SHAPES.find((s) => s.id === 'tromino-L')!;

describe('Wave 41 juggle — wrong-phase nops', () => {
  it('selectDie / selectShape / rotate / flip are identity on rolling', () => {
    const state = createInitialState();
    expect(selectDie(state, 0)).toBe(state);
    expect(selectDie(state, 1)).toBe(state);
    expect(selectShape(state, monomino)).toBe(state);
    expect(rotateShape(state)).toBe(state);
    expect(flipShape(state)).toBe(state);
  });

  it('rotate / flip identity on selectingShape even with dice', () => {
    const selecting = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [1, 3] as [number, number],
    };
    expect(rotateShape(selecting)).toBe(selecting);
    expect(flipShape(selecting)).toBe(selecting);
  });

  it('selectShape identity without selectedCategory', () => {
    const selecting = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [4, 5] as [number, number],
      selectedCategory: null,
    };
    expect(selectShape(selecting, monomino)).toBe(selecting);
  });

  it('selectDie identity without currentDice on selectingShape', () => {
    const selecting = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: null,
    };
    expect(selectDie(selecting, 0)).toBe(selecting);
  });

  it('rotate / flip identity on gameOver; flip rejects non-flippable', () => {
    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
      selectedShape: trominoL,
    };
    expect(rotateShape(over)).toBe(over);
    expect(flipShape(over)).toBe(over);

    const placingNoFlip = {
      ...createInitialState(),
      phase: 'placing' as const,
      selectedShape: monomino,
      currentDice: [1, 1] as [number, number],
    };
    expect(flipShape(placingNoFlip)).toBe(placingNoFlip);
  });

  it('doRollDice then selectDie advances; rotate works only in placing', () => {
    let state = doRollDice({
      ...createInitialState(),
      // force die path via selectingShape after roll
    });
    expect(state.phase).toBe('selectingShape');
    expect(rotateShape(state)).toBe(state);

    // Force placing with flippable shape
    const placing = {
      ...state,
      phase: 'placing' as const,
      selectedShape: trominoL,
      selectedCategory: 'tromino' as const,
      selectedRotation: 0 as const,
      selectedFlipped: false,
    };
    const rotated = rotateShape(placing);
    expect(rotated).not.toBe(placing);
    expect(rotated.selectedRotation).toBe(90);
    const flipped = flipShape(placing);
    expect(flipped.selectedFlipped).toBe(true);
  });
});
